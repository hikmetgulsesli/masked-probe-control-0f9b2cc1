/**
 * React Context state store for the Masked Probe Control feature.
 *
 * Owns shared app shell state (active route, active panel, records, selected
 * entity, storage status, last error, preferences). The store is the single
 * source of truth; sibling stories MUST consume `useMaskedProbeStore` instead
 * of reimplementing their own state.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

import { maskedProbeFixture } from "../../__fixtures__/masked-probe-control.fixture";
import { maskedProbeRepo } from "./masked-probe-control.repo";
import {
  DEFAULT_PREFERENCES,
  DEFAULT_STATE,
  type MaskedProbeAction,
  type MaskedProbePanelId,
  type MaskedProbePreferences,
  type MaskedProbeRecord,
  type MaskedProbeRoute,
  type MaskedProbeState,
  type MaskedProbeStore,
} from "./masked-probe-control.types";

const MaskedProbeContext = createContext<MaskedProbeStore | null>(null);

const reducer = (state: MaskedProbeState, action: MaskedProbeAction): MaskedProbeState => {
  switch (action.type) {
    case "app/bootstrap": {
      const records = action.payload.records ?? [];
      return {
        ...state,
        records,
        hydrated: true,
        lastError: null,
      };
    }
    case "app/hydrated": {
      const incoming = action.payload.preferences;
      return {
        ...state,
        preferences: incoming ? { ...DEFAULT_PREFERENCES, ...incoming } : state.preferences,
      };
    }
    case "app/storage-status": {
      return { ...state, storageStatus: action.payload.status };
    }
    case "app/error": {
      return { ...state, lastError: action.payload.error };
    }
    case "app/navigate": {
      return {
        ...state,
        activeRoute: action.payload.route,
        activeScreenId: action.payload.screenId,
      };
    }
    case "app/select-record": {
      return { ...state, selectedRecordId: action.payload.recordId };
    }
    case "app/set-panel": {
      return {
        ...state,
        activePanel: action.payload.panel,
        preferences: { ...state.preferences, activePanel: action.payload.panel },
      };
    }
    case "app/set-preference": {
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload.patch },
      };
    }
    case "app/upsert-record": {
      const incoming = action.payload.record;
      const existingIndex = state.records.findIndex((record) => record.id === incoming.id);
      if (existingIndex === -1) {
        return { ...state, records: [...state.records, incoming] };
      }
      const next = state.records.slice();
      next[existingIndex] = incoming;
      return { ...state, records: next };
    }
    case "app/remove-record": {
      return {
        ...state,
        records: state.records.filter((record) => record.id !== action.payload.recordId),
        selectedRecordId:
          state.selectedRecordId === action.payload.recordId ? null : state.selectedRecordId,
      };
    }
    case "app/reset-preferences": {
      return { ...state, preferences: { ...DEFAULT_PREFERENCES } };
    }
    default: {
      return state;
    }
  }
};

export interface MaskedProbeProviderProps {
  children: ReactNode;
  initialRecords?: MaskedProbeRecord[];
  /** Override storage in tests; defaults to the real localStorage-backed repo. */
  repo?: typeof maskedProbeRepo;
  /**
   * When true, the provider hydrates from persistence on mount. Tests can
   * disable this to keep state deterministic.
   */
  hydrateOnMount?: boolean;
}

export const MaskedProbeProvider = ({
  children,
  initialRecords,
  repo = maskedProbeRepo,
  hydrateOnMount = true,
}: MaskedProbeProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...DEFAULT_STATE,
    records: initialRecords ? [...initialRecords] : [...maskedProbeFixture],
  });

  const lastSavedPreferencesRef = useRef<MaskedProbePreferences>(state.preferences);

  // Hydrate from persistence on mount.
  useEffect(() => {
    if (!hydrateOnMount) {
      dispatch({ type: "app/storage-status", payload: { status: repo.supported ? "ready" : "unavailable" } });
      return;
    }
    const result = repo.load();
    dispatch({ type: "app/storage-status", payload: { status: result.status } });
    if (result.status === "corrupted") {
      dispatch({
        type: "app/error",
        payload: {
          error: {
            source: "persistence",
            message: result.errorMessage ?? "stored preferences could not be loaded",
            recoverable: true,
            raisedAt: new Date().toISOString(),
          },
        },
      });
      // Recover: clear the corrupted blob so the next save starts clean.
      repo.clear();
    }
    if (result.preferences) {
      dispatch({ type: "app/hydrated", payload: { preferences: result.preferences } });
      lastSavedPreferencesRef.current = result.preferences;
    }
  }, [hydrateOnMount, repo]);

  // Persist preferences whenever they change.
  useEffect(() => {
    if (state.storageStatus === "unavailable") return;
    if (state.preferences === lastSavedPreferencesRef.current) return;
    const result = repo.save(state.preferences);
    if (result.status === "ready") {
      lastSavedPreferencesRef.current = state.preferences;
    } else {
      dispatch({ type: "app/storage-status", payload: { status: result.status } });
    }
  }, [repo, state.preferences, state.storageStatus]);

  const selectRecord = useCallback(
    (recordId: string | null) => {
      dispatch({ type: "app/select-record", payload: { recordId } });
    },
    [],
  );

  const navigate = useCallback((route: MaskedProbeRoute, screenId: string) => {
    dispatch({ type: "app/navigate", payload: { route, screenId } });
  }, []);

  const setPanel = useCallback((panel: MaskedProbePanelId) => {
    dispatch({ type: "app/set-panel", payload: { panel } });
  }, []);

  const upsertRecord = useCallback((record: MaskedProbeRecord) => {
    dispatch({ type: "app/upsert-record", payload: { record } });
  }, []);

  const removeRecord = useCallback((recordId: string) => {
    dispatch({ type: "app/remove-record", payload: { recordId } });
  }, []);

  const setPreference = useCallback((patch: Partial<MaskedProbePreferences>) => {
    dispatch({ type: "app/set-preference", payload: { patch } });
  }, []);

  const resetPreferences = useCallback(() => {
    dispatch({ type: "app/reset-preferences" });
  }, []);

  const refreshTelemetry = useCallback(() => {
    // Sibling story (telemetry) owns the actual fetch. US-001 only exposes
    // the shell hook so the screen button has a stable handler. We bump
    // the updatedAt timestamp on online probes so the shell visibly reacts.
    const nextRecords = state.records.map((record) =>
      record.status === "offline"
        ? record
        : { ...record, updatedAt: new Date().toISOString() },
    );
    nextRecords.forEach((record) => {
      dispatch({ type: "app/upsert-record", payload: { record } });
    });
  }, [state.records]);

  const store = useMemo<MaskedProbeStore>(
    () => ({
      state,
      dispatch,
      selectRecord,
      navigate,
      setPanel,
      upsertRecord,
      removeRecord,
      setPreference,
      resetPreferences,
      refreshTelemetry,
    }),
    [
      state,
      selectRecord,
      navigate,
      setPanel,
      upsertRecord,
      removeRecord,
      setPreference,
      resetPreferences,
      refreshTelemetry,
    ],
  );

  return <MaskedProbeContext.Provider value={store}>{children}</MaskedProbeContext.Provider>;
};

export const useMaskedProbeStore = (): MaskedProbeStore => {
  const store = useContext(MaskedProbeContext);
  if (!store) {
    throw new Error("useMaskedProbeStore must be used within a MaskedProbeProvider");
  }
  return store;
};

export const useMaskedProbeState = (): MaskedProbeState => useMaskedProbeStore().state;

// (Intentionally no internal alias — all types come from the public surface.)