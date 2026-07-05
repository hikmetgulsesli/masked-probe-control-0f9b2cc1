/**
 * Domain types for the Masked Probe Control feature.
 *
 * US-001 owns the shared app shell, navigation, persistence, and the test
 * bridge (`window.app`). Sibling stories consume these types but should not
 * redefine them.
 */

export type MaskedProbeRecordId = string;

export type MaskedProbeStatus = "online" | "degraded" | "offline";

export interface MaskedProbeRecord {
  id: MaskedProbeRecordId;
  label: string;
  endpoint: string;
  status: MaskedProbeStatus;
  latencyMs: number;
  maskedToken: string;
  updatedAt: string;
}

export type MaskedProbePanelId =
  | "overview"
  | "details"
  | "telemetry";

export type MaskedProbeRoute = "/" | "/probe" | "/settings";

export type StorageStatus = "idle" | "ready" | "corrupted" | "unavailable";

export interface MaskedProbeLastError {
  source: "persistence" | "bootstrap";
  message: string;
  recoverable: boolean;
  raisedAt: string;
}

export interface MaskedProbePreferences {
  activePanel: MaskedProbePanelId;
  searchQuery: string;
  autoRefresh: boolean;
}

export interface MaskedProbeState {
  activeRoute: MaskedProbeRoute;
  activeScreenId: string;
  activePanel: MaskedProbePanelId;
  records: MaskedProbeRecord[];
  selectedRecordId: MaskedProbeRecordId | null;
  storageStatus: StorageStatus;
  lastError: MaskedProbeLastError | null;
  preferences: MaskedProbePreferences;
  hydrated: boolean;
}

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
  | { type: "app/remove-record"; payload: { recordId: MaskedProbeRecordId } }
  | { type: "app/reset-preferences" };

export interface MaskedProbeStore {
  state: MaskedProbeState;
  dispatch: (action: MaskedProbeAction) => void;
  selectRecord: (recordId: MaskedProbeRecordId | null) => void;
  navigate: (route: MaskedProbeRoute, screenId: string) => void;
  setPanel: (panel: MaskedProbePanelId) => void;
  upsertRecord: (record: MaskedProbeRecord) => void;
  removeRecord: (recordId: MaskedProbeRecordId) => void;
  setPreference: (patch: Partial<MaskedProbePreferences>) => void;
  resetPreferences: () => void;
  refreshTelemetry: () => void;
}

export const STORAGE_KEY = "masked-probe-control:v1";

export const DEFAULT_PREFERENCES: MaskedProbePreferences = {
  activePanel: "overview",
  searchQuery: "",
  autoRefresh: true,
};

export const DEFAULT_STATE: MaskedProbeState = {
  activeRoute: "/",
  activeScreenId: "d72f276f6e2445e8ae548d77e72aa050",
  activePanel: "overview",
  records: [],
  selectedRecordId: null,
  storageStatus: "idle",
  lastError: null,
  preferences: DEFAULT_PREFERENCES,
  hydrated: false,
};

export function getRecordCount(state: MaskedProbeState): number {
  return state.records.length;
}

export function getOnlineCount(state: MaskedProbeState): number {
  return state.records.filter((record) => record.status === "online").length;
}

export function findRecord(
  state: MaskedProbeState,
  recordId: MaskedProbeRecordId | null,
): MaskedProbeRecord | null {
  if (!recordId) return null;
  return state.records.find((record) => record.id === recordId) ?? null;
}