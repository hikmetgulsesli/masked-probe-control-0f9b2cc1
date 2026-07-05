/**
 * Test bridge exposing the Masked Probe Control store to sibling stories,
 * the runtime harness, and any non-React consumer (smoke tests, end-to-end
 * probes, etc.).
 *
 * We use ES6 getters on `window.app` so each property access returns the
 * freshest value from the current store instance. That avoids the stale
 * snapshot problem flagged by code review: callers always see live state.
 */

import {
  findRecord,
  type MaskedProbeStoreApi,
} from "../features/masked-probe-control/masked-probe-control.store";
import type {
  MaskedProbePanelId,
  MaskedProbePreferences,
  MaskedProbeRecord,
  MaskedProbeRecordId,
  MaskedProbeRoute,
  StorageStatus,
} from "../features/masked-probe-control/masked-probe-control.types";

export interface AppBridgeCounts {
  records: number;
  online: number;
  offline: number;
  degraded: number;
}

export interface AppBridgeActions {
  navigate: (route: MaskedProbeRoute, screenId: string) => void;
  selectRecord: (recordId: MaskedProbeRecordId | null) => void;
  setPanel: (panel: MaskedProbePanelId) => void;
  upsertRecord: (record: MaskedProbeRecord) => void;
  removeRecord: (recordId: MaskedProbeRecordId) => void;
  setPreference: (patch: Partial<MaskedProbePreferences>) => void;
  resetPreferences: () => void;
  refreshTelemetry: () => void;
}

export interface AppBridge {
  activeScreen: string;
  activeRoute: MaskedProbeRoute;
  activePanel: MaskedProbePanelId;
  selectedRecord: MaskedProbeRecord | null;
  counts: AppBridgeCounts;
  storageStatus: StorageStatus;
  lastError: unknown;
  preferences: MaskedProbePreferences;
  actions: AppBridgeActions;
  records: MaskedProbeRecord[];
}

declare global {
  interface Window {
    app?: AppBridge;
    __maskedProbeStore?: MaskedProbeStoreApi;
  }
}

const getRecordCount = (records: MaskedProbeRecord[]) => records.length;
const getOnlineCount = (records: MaskedProbeRecord[]) =>
  records.filter((record) => record.status === "online").length;
const getOfflineCount = (records: MaskedProbeRecord[]) =>
  records.filter((record) => record.status === "offline").length;
const getDegradedCount = (records: MaskedProbeRecord[]) =>
  records.filter((record) => record.status === "degraded").length;

let getStore: (() => MaskedProbeStoreApi | null) | null = null;

/**
 * Refreshes the `window.app` snapshot. Every property on the snapshot is
 * an ES6 getter that defers to the live store accessor, so callers always
 * read the freshest value without needing to call `refreshBridge` again.
 */
export const refreshBridge = (): void => {
  if (typeof window === "undefined" || !getStore) return;
  const snapshot: AppBridge = {
    get activeScreen() {
      return getStore ? (getStore()?.state.activeScreenId ?? "") : "";
    },
    get activeRoute() {
      return getStore ? (getStore()?.state.activeRoute ?? "/") : "/";
    },
    get activePanel() {
      return getStore ? (getStore()?.state.activePanel ?? "overview") : "overview";
    },
    get selectedRecord() {
      const store = getStore?.();
      return store ? findRecord(store.state, store.state.selectedRecordId) : null;
    },
    get counts() {
      const store = getStore?.();
      const records = store?.state.records ?? [];
      return {
        records: store ? getRecordCount(records) : 0,
        online: store ? getOnlineCount(records) : 0,
        offline: store ? getOfflineCount(records) : 0,
        degraded: store ? getDegradedCount(records) : 0,
      };
    },
    get storageStatus() {
      return getStore ? (getStore()?.state.storageStatus ?? "idle") : "idle";
    },
    get lastError() {
      return getStore ? (getStore()?.state.lastError ?? null) : null;
    },
    get preferences() {
      return (
        getStore?.()?.state.preferences ?? {
          autoRefresh: false,
          paused: false,
          lastSelectedRecordId: null,
        }
      );
    },
    get records() {
      return getStore?.()?.state.records ?? [];
    },
    get actions() {
      const store = getStore?.();
      return {
        navigate: (route, screenId) => store?.navigate(route, screenId),
        selectRecord: (recordId) => store?.selectRecord(recordId),
        setPanel: (panel) => store?.setPanel(panel),
        upsertRecord: (record) => store?.upsertRecord(record),
        removeRecord: (recordId) => store?.removeRecord(recordId),
        setPreference: (patch) => store?.setPreference(patch),
        resetPreferences: () => store?.resetPreferences(),
        refreshTelemetry: () => store?.refreshTelemetry(),
      } as AppBridge["actions"];
    },
  };
  window.app = snapshot;
  Object.defineProperty(window, "__maskedProbeStore", {
    get: () => getStore?.() ?? null,
    configurable: true,
  });
};

/**
 * Register the store accessor so the bridge always reads from the live
 * instance. Called by `App` immediately after mounting the provider.
 */
export const registerStoreAccessor = (
  accessor: () => MaskedProbeStoreApi | null,
): void => {
  getStore = accessor;
  if (typeof window !== "undefined") {
    refreshBridge();
  }
};
