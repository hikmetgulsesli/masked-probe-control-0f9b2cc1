/**
 * Shared domain types for the Masked Probe Control app shell.
 *
 * These types describe the shape of records the rest of the application
 * (telemetry story, settings story, etc.) reads and writes. Keeping them in
 * a single module lets the store, repository, fixtures, and test bridge
 * share one contract without circular imports.
 */

export type MaskedProbeRecordId = string;

export type MaskedProbeRoute = "/" | "/status" | "/probe/:recordId" | "/settings";

export type MaskedProbePanelId = "overview" | "details" | "settings";

export type StorageStatus = "idle" | "ready" | "unavailable";

export type MaskedProbeRecordStatus = "online" | "offline" | "degraded";

export interface MaskedProbeRecord {
  id: MaskedProbeRecordId;
  label: string;
  status: MaskedProbeRecordStatus;
  updatedAt: string; // ISO-8601 timestamp
}

export interface MaskedProbePreferences {
  autoRefresh: boolean;
  paused: boolean;
  lastSelectedRecordId: MaskedProbeRecordId | null;
}

export interface MaskedProbeLastError {
  message: string;
  source: "storage" | "telemetry" | "ui";
  recoverable: boolean;
}

export interface MaskedProbeState {
  hydrated: boolean;
  storageStatus: StorageStatus;
  activeScreenId: string;
  activeRoute: MaskedProbeRoute;
  activePanel: MaskedProbePanelId;
  selectedRecordId: MaskedProbeRecordId | null;
  records: MaskedProbeRecord[];
  preferences: MaskedProbePreferences;
  lastError: MaskedProbeLastError | null;
  lastRefreshedAt: string | null;
}

export const DEFAULT_PREFERENCES: MaskedProbePreferences = {
  autoRefresh: false,
  paused: false,
  lastSelectedRecordId: null,
};

export const INITIAL_STATE: MaskedProbeState = {
  hydrated: false,
  storageStatus: "idle",
  activeScreenId: "status-utility-masked-probe-control",
  activeRoute: "/status",
  activePanel: "overview",
  selectedRecordId: null,
  records: [],
  preferences: DEFAULT_PREFERENCES,
  lastError: null,
  lastRefreshedAt: null,
};

export type MaskedProbeAction =
  | { type: "app/bootstrap"; payload: { records: MaskedProbeRecord[] } }
  | { type: "app/hydrated"; payload: { preferences: MaskedProbePreferences | null } }
  | { type: "app/storage-status"; payload: { status: StorageStatus } }
  | { type: "app/error"; payload: { error: MaskedProbeLastError | null } }
  | { type: "app/navigate"; payload: { route: MaskedProbeRoute; screenId: string } }
  | { type: "app/select-record"; payload: { recordId: MaskedProbeRecordId | null } }
  | { type: "app/set-panel"; payload: { panel: MaskedProbePanelId } }
  | { type: "app/set-preference"; payload: { patch: Partial<MaskedProbePreferences> } }
  | { type: "app/upsert-record"; payload: { record: MaskedProbeRecord } }
  | { type: "app/upsert-records"; payload: { records: MaskedProbeRecord[] } }
  | { type: "app/remove-record"; payload: { recordId: MaskedProbeRecordId } }
  | { type: "app/reset-preferences" };

export const MASKED_PROBE_PREFERENCE_STORAGE_KEY = "masked-probe-control/preferences/v1";
