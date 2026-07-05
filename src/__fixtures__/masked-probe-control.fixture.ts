import type { MaskedProbeRecord, MaskedProbePreferences } from "../features/masked-probe-control/masked-probe-control.types";

/**
 * Sample records used as the initial dataset for the app shell.
 *
 * The telemetry story will replace this with live data, but the shell
 * needs deterministic records so it can render the status cards before
 * the telemetry fetch resolves.
 */
export const maskedProbeFixtureRecords: MaskedProbeRecord[] = [
  {
    id: "probe-aurora",
    label: "Aurora",
    status: "online",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "probe-helios",
    label: "Helios",
    status: "degraded",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "probe-erebus",
    label: "Erebus",
    status: "offline",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

/**
 * Default preference payload. Used by tests and the persistence layer
 * when nothing has been stored yet, so the application boots in a stable
 * state without guessing user intent.
 */
export const maskedProbeFixturePreferences: MaskedProbePreferences = {
  autoRefresh: false,
  paused: false,
  lastSelectedRecordId: null,
};
