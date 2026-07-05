/**
 * Test bridge exposing the Masked Probe Control app shell on `window.app`.
 *
 * Sibling stories and the runtime evidence harness rely on this contract to
 * introspect the live app:
 *
 *   window.app.activeScreen   -> current screen id
 *   window.app.activeRoute    -> current route
 *   window.app.activePanel    -> "overview" | "details" | "telemetry"
 *   window.app.selectedRecord -> currently selected record (or null)
 *   window.app.counts         -> { records, online }
 *   window.app.storageStatus  -> "idle" | "ready" | "corrupted" | "unavailable"
 *   window.app.lastError      -> last surfaced error (or null)
 *   window.app.actions        -> stable handler set exposed to siblings
 *
 * The bridge subscribes to the store via `getStore()` so it always reflects
 * the freshest state without re-rendering React.
 */

import {
  findRecord,
  getOnlineCount,
  getRecordCount,
  type MaskedProbeStore,
} from "../features/masked-probe-control/masked-probe-control.types";

export interface AppBridge {
  activeScreen: string;
  activeRoute: string;
  activePanel: string;
  selectedRecord: ReturnType<typeof findRecord>;
  counts: { records: number; online: number };
  storageStatus: string;
  lastError: unknown;
  actions: {
    navigate: MaskedProbeStore["navigate"];
    selectRecord: MaskedProbeStore["selectRecord"];
    setPanel: MaskedProbeStore["setPanel"];
    upsertRecord: MaskedProbeStore["upsertRecord"];
    removeRecord: MaskedProbeStore["removeRecord"];
    setPreference: MaskedProbeStore["setPreference"];
    resetPreferences: MaskedProbeStore["resetPreferences"];
    refreshTelemetry: MaskedProbeStore["refreshTelemetry"];
  };
}

declare global {
  interface Window {
    app?: AppBridge;
    __maskedProbeStore?: MaskedProbeStore;
  }
}

let getStore: (() => MaskedProbeStore) | null = null;

export const registerStoreAccessor = (accessor: () => MaskedProbeStore): (() => void) => {
  getStore = accessor;
  refreshBridge();
  return () => {
    if (getStore === accessor) {
      getStore = null;
      if (typeof window !== "undefined") {
        delete window.app;
        delete window.__maskedProbeStore;
      }
    }
  };
};

export const refreshBridge = (): void => {
  if (typeof window === "undefined" || !getStore) return;
  const store = getStore();
  const snapshot: AppBridge = {
    activeScreen: store.state.activeScreenId,
    activeRoute: store.state.activeRoute,
    activePanel: store.state.activePanel,
    selectedRecord: findRecord(store.state, store.state.selectedRecordId),
    counts: {
      records: getRecordCount(store.state),
      online: getOnlineCount(store.state),
    },
    storageStatus: store.state.storageStatus,
    lastError: store.state.lastError,
    actions: {
      navigate: store.navigate,
      selectRecord: store.selectRecord,
      setPanel: store.setPanel,
      upsertRecord: store.upsertRecord,
      removeRecord: store.removeRecord,
      setPreference: store.setPreference,
      resetPreferences: store.resetPreferences,
      refreshTelemetry: store.refreshTelemetry,
    },
  };
  window.app = snapshot;
  window.__maskedProbeStore = store;
};

export const getBridge = (): AppBridge | null => {
  if (typeof window === "undefined") return null;
  return window.app ?? null;
};