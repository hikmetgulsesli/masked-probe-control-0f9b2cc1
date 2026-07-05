/**
 * Persistence adapter for the Masked Probe Control feature.
 *
 * Persists user preferences to `localStorage` under STORAGE_KEY. When the
 * stored payload fails to parse or fails schema validation, the repository
 * signals `corrupted` so the store can surface recoverable feedback and
 * fall back to defaults.
 *
 * The adapter is defensive: it never throws into application code; callers
 * receive a `MaskedProbePreferences | null` plus a status flag.
 */

import {
  DEFAULT_PREFERENCES,
  STORAGE_KEY,
  type MaskedProbePreferences,
  type StorageStatus,
} from "./masked-probe-control.types";

interface LoadResult {
  preferences: MaskedProbePreferences | null;
  status: StorageStatus;
  errorMessage: string | null;
}

interface SaveResult {
  status: StorageStatus;
  errorMessage: string | null;
}

export interface MaskedProbeRepo {
  load(): LoadResult;
  save(preferences: MaskedProbePreferences): SaveResult;
  clear(): SaveResult;
  readonly supported: boolean;
}

const isPreferencesObject = (value: unknown): value is MaskedProbePreferences => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.activePanel !== "string") return false;
  if (typeof candidate.searchQuery !== "string") return false;
  if (typeof candidate.autoRefresh !== "boolean") return false;
  if (!isPanelId(candidate.activePanel)) return false;
  return true;
};

const isPanelId = (value: unknown): boolean => {
  return value === "overview" || value === "details" || value === "telemetry";
};

const getStorage = (): Storage | null => {
  try {
    if (typeof globalThis === "undefined") return null;
    const candidate = (globalThis as { localStorage?: Storage }).localStorage;
    if (!candidate) return null;
    // Probe write/read — some environments expose localStorage but throw on use.
    const probeKey = "__masked_probe_probe__";
    candidate.setItem(probeKey, "1");
    candidate.removeItem(probeKey);
    return candidate;
  } catch {
    return null;
  }
};

const buildRepo = (): MaskedProbeRepo => {
  const storage = getStorage();

  if (!storage) {
    return {
      supported: false,
      load: () => ({ preferences: null, status: "unavailable", errorMessage: null }),
      save: () => ({ status: "unavailable", errorMessage: null }),
      clear: () => ({ status: "unavailable", errorMessage: null }),
    };
  }

  return {
    supported: true,
    load(): LoadResult {
      let raw: string | null = null;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch (error) {
        return {
          preferences: null,
          status: "unavailable",
          errorMessage: describeError(error),
        };
      }

      if (!raw) {
        return { preferences: null, status: "ready", errorMessage: null };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        return {
          preferences: null,
          status: "corrupted",
          errorMessage: describeError(error),
        };
      }

      if (!isPreferencesObject(parsed)) {
        return {
          preferences: null,
          status: "corrupted",
          errorMessage: "stored payload failed schema validation",
        };
      }

      return { preferences: parsed, status: "ready", errorMessage: null };
    },
    save(preferences: MaskedProbePreferences): SaveResult {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        return { status: "ready", errorMessage: null };
      } catch (error) {
        return { status: "unavailable", errorMessage: describeError(error) };
      }
    },
    clear(): SaveResult {
      try {
        storage.removeItem(STORAGE_KEY);
        return { status: "ready", errorMessage: null };
      } catch (error) {
        return { status: "unavailable", errorMessage: describeError(error) };
      }
    },
  };
};

const describeError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown persistence error";
  }
};

export const maskedProbeRepo: MaskedProbeRepo = buildRepo();

export const __test = {
  STORAGE_KEY,
  DEFAULT_PREFERENCES,
  isPreferencesObject,
};

export type { LoadResult, SaveResult };