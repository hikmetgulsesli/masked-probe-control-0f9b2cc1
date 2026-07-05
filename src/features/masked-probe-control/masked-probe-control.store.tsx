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
import { maskedProbeFixtureRecords } from "../../__fixtures__/masked-probe-control.fixture";
import {
  createLocalStoragePreferencesRepo,
  type MaskedProbePreferencesRepo,
} from "./masked-probe-control.repo";
import {
  DEFAULT_PREFERENCES,
  INITIAL_STATE,
  type MaskedProbeAction,
  type MaskedProbeLastError,
  type MaskedProbePanelId,
  type MaskedProbePreferences,
  type MaskedProbeRecord,
  type MaskedProbeRecordId,
  type MaskedProbeRoute,
  type MaskedProbeState,
  type StorageStatus,
} from "./masked-probe-control.types";

/**
 * Pure reducer for the application shell. Keeping the reducer pure means
 * the persistence effect (and tests) can call `dispatch` repeatedly
 * without leaking side-effects into the state tree.
 */
export const maskedProbeReducer = (
  state: MaskedProbeState,
  action: MaskedProbeAction,
): MaskedProbeState => {
  switch (action.type) {
    case "app/bootstrap": {
      // Respect the hydrated lastSelectedRecordId preference when it still
      // points at a known record. Without this branch, hydration runs first
      // (selectedRecordId stays null), then bootstrap runs and overwrites
      // the user's last selection with records[0]?.id.
      const preferredId = state.preferences.lastSelectedRecordId;
      const hasPreferred =
        !!preferredId &&
        action.payload.records.some((record) => record.id === preferredId);
      return {
        ...state,
        hydrated: true,
        records: action.payload.records,
        selectedRecordId:
          state.selectedRecordId ??
          (hasPreferred
            ? preferredId
            : action.payload.records[0]?.id ?? null),
      };
    }
    case "app/hydrated":
      return {
        ...state,
        hydrated: true,
        preferences: action.payload.preferences ?? state.preferences,
      };
    case "app/storage-status":
      return { ...state, storageStatus: action.payload.status };
    case "app/error":
      return { ...state, lastError: action.payload.error };
    case "app/navigate":
      return {
        ...state,
        activeRoute: action.payload.route,
        activeScreenId: action.payload.screenId,
      };
    case "app/select-record":
      return {
        ...state,
        selectedRecordId: action.payload.recordId,
        preferences: {
          ...state.preferences,
          lastSelectedRecordId: action.payload.recordId,
        },
      };
    case "app/set-panel":
      return { ...state, activePanel: action.payload.panel };
    case "app/set-preference":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload.patch },
      };
    case "app/upsert-record": {
      const incoming = action.payload.record;
      const existingIndex = state.records.findIndex(
        (record) => record.id === incoming.id,
      );
      if (existingIndex === -1) {
        return { ...state, records: [...state.records, incoming] };
      }
      const next = state.records.slice();
      next[existingIndex] = incoming;
      return { ...state, records: next };
    }
    case "app/upsert-records": {
      const incoming = action.payload.records;
      const next = state.records.map((record) => {
        const match = incoming.find((r) => r.id === record.id);
        return match ? match : record;
      });
      const brandNew = incoming.filter(
        (r) => !state.records.some((existing) => existing.id === r.id),
      );
      return { ...state, records: [...next, ...brandNew] };
    }
    case "app/remove-record":
      return {
        ...state,
        records: state.records.filter(
          (record) => record.id !== action.payload.recordId,
        ),
        selectedRecordId:
          state.selectedRecordId === action.payload.recordId
            ? null
            : state.selectedRecordId,
      };
    case "app/reset-preferences":
      return { ...state, preferences: DEFAULT_PREFERENCES };
    default:
      return state;
  }
};

export interface MaskedProbeStoreApi {
  state: MaskedProbeState;
  dispatch: (action: MaskedProbeAction) => void;
  navigate: (route: MaskedProbeRoute, screenId: string) => void;
  selectRecord: (recordId: MaskedProbeRecordId | null) => void;
  setPanel: (panel: MaskedProbePanelId) => void;
  setPreference: (patch: Partial<MaskedProbePreferences>) => void;
  upsertRecord: (record: MaskedProbeRecord) => void;
  removeRecord: (recordId: MaskedProbeRecordId) => void;
  resetPreferences: () => void;
  refreshTelemetry: () => void;
}

const MaskedProbeStoreContext = createContext<MaskedProbeStoreApi | null>(null);

export interface MaskedProbeStoreProviderProps {
  children: ReactNode;
  /**
   * Override the persistence layer (mostly for tests). Defaults to a
   * localStorage-backed repo when available, which is what the app shell
   * needs in production.
   */
  repo?: MaskedProbePreferencesRepo;
  /**
   * Inject pre-loaded records for tests or one-off fixtures. When omitted
   * we use the bundled fixture dataset so the shell is never empty.
   */
  initialRecords?: MaskedProbeRecord[];
}

/**
 * Application shell store. Exposes navigation, persistence, and refresh
 * actions through a single React Context so every screen can stay
 * declarative while sibling stories reuse the same backing state.
 */
export const MaskedProbeStoreProvider = ({
  children,
  repo,
  initialRecords,
}: MaskedProbeStoreProviderProps) => {
  const resolvedRepo = useMemo<MaskedProbePreferencesRepo>(
    () => repo ?? createLocalStoragePreferencesRepo(),
    [repo],
  );

  const [state, dispatch] = useReducer(maskedProbeReducer, INITIAL_STATE);
  const lastSavedPreferencesRef = useRef<MaskedProbePreferences>(
    INITIAL_STATE.preferences,
  );

  // Hydrate the persisted preferences exactly once per provider mount.
  useEffect(() => {
    const { preferences, status } = resolvedRepo.load();
    dispatch({
      type: "app/hydrated",
      payload: { preferences },
    });
    dispatch({ type: "app/storage-status", payload: { status } });
    lastSavedPreferencesRef.current =
      preferences ?? INITIAL_STATE.preferences;
  }, [resolvedRepo]);

  // Persist preferences whenever they change.
  useEffect(() => {
    if (state.storageStatus === "unavailable") return;
    if (state.preferences === lastSavedPreferencesRef.current) return;

    // Update ref immediately to prevent infinite loops if dispatching triggers a re-run.
    lastSavedPreferencesRef.current = state.preferences;

    const result = resolvedRepo.save(state.preferences);
    if (result.status !== "ready") {
      dispatch({ type: "app/storage-status", payload: { status: result.status } });
    }
  }, [resolvedRepo, state.preferences, state.storageStatus]);

  // Surface a recoverable error rather than silently dropping it. Sibling
  // stories (telemetry) can call this via the bridge.
  const setError = useCallback((error: MaskedProbeLastError | null) => {
    dispatch({ type: "app/error", payload: { error } });
  }, []);

  const navigate = useCallback<MaskedProbeStoreApi["navigate"]>(
    (route, screenId) => {
      dispatch({ type: "app/navigate", payload: { route, screenId } });
    },
    [],
  );

  const selectRecord = useCallback<MaskedProbeStoreApi["selectRecord"]>(
    (recordId) => {
      dispatch({ type: "app/select-record", payload: { recordId } });
    },
    [],
  );

  const setPanel = useCallback<MaskedProbeStoreApi["setPanel"]>((panel) => {
    dispatch({ type: "app/set-panel", payload: { panel } });
  }, []);

  const setPreference = useCallback<MaskedProbeStoreApi["setPreference"]>(
    (patch) => {
      dispatch({ type: "app/set-preference", payload: { patch } });
    },
    [],
  );

  const upsertRecord = useCallback<MaskedProbeStoreApi["upsertRecord"]>(
    (record) => {
      dispatch({ type: "app/upsert-record", payload: { record } });
    },
    [],
  );

  const removeRecord = useCallback<MaskedProbeStoreApi["removeRecord"]>(
    (recordId) => {
      dispatch({ type: "app/remove-record", payload: { recordId } });
    },
    [],
  );

  const resetPreferences = useCallback<MaskedProbeStoreApi["resetPreferences"]>(
    () => {
      dispatch({ type: "app/reset-preferences" });
    },
    [],
  );

  const refreshTelemetry = useCallback<
    MaskedProbeStoreApi["refreshTelemetry"]
  >(() => {
    // Sibling story (telemetry) owns the actual fetch. US-001 only exposes
    // the shell hook so the screen button has a stable handler. We bump
    // the updatedAt timestamp on online probes so the shell visibly reacts.
    const nextRecords = state.records.map((record) =>
      record.status === "offline"
        ? record
        : { ...record, updatedAt: new Date().toISOString() },
    );
    dispatch({ type: "app/upsert-records", payload: { records: nextRecords } });
  }, [state.records]);

  // Make sure the store always has *some* records available so the very
  // first render isn't blank. The bootstrap action is idempotent: if a
  // sibling story already fed records in, the reducer keeps whichever
  // set the user last interacted with.
  useEffect(() => {
    if (state.hydrated && state.records.length === 0) {
      dispatch({
        type: "app/bootstrap",
        payload: { records: initialRecords ?? maskedProbeFixtureRecords },
      });
    }
  }, [state.hydrated, state.records.length, initialRecords]);

  const value = useMemo<MaskedProbeStoreApi>(
    () => ({
      state,
      dispatch,
      navigate,
      selectRecord,
      setPanel,
      setPreference,
      upsertRecord,
      removeRecord,
      resetPreferences,
      refreshTelemetry,
    }),
    [
      state,
      navigate,
      selectRecord,
      setPanel,
      setPreference,
      upsertRecord,
      removeRecord,
      resetPreferences,
      refreshTelemetry,
    ],
  );

  return (
    <MaskedProbeStoreContext.Provider value={value}>
      {children}
    </MaskedProbeStoreContext.Provider>
  );
};

export const useMaskedProbeStore = (): MaskedProbeStoreApi => {
  const value = useContext(MaskedProbeStoreContext);
  if (!value) {
    throw new Error(
      "useMaskedProbeStore must be used inside a MaskedProbeStoreProvider",
    );
  }
  return value;
};

// Internal helper kept exported so the test bridge can run the same
// record-resolution logic as the visible UI. Tests assert on the
// resolved record, not on internal indices.
export const findRecord = (
  state: MaskedProbeState,
  id: MaskedProbeRecordId | null | undefined,
): MaskedProbeRecord | null => {
  if (!id) return null;
  return state.records.find((record) => record.id === id) ?? null;
};

// Re-export so consumers don't have to drill through the types module
// when they need the full storage status union.
export type { StorageStatus };
