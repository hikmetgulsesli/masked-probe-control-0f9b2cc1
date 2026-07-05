import {
  DEFAULT_PREFERENCES,
  MASKED_PROBE_PREFERENCE_STORAGE_KEY,
  type MaskedProbePreferences,
  type StorageStatus,
} from "./masked-probe-control.types";

/**
 * Persistence boundary for user preferences.
 *
 * The repo deliberately hides the storage backend behind a small interface
 * so the store can stay storage-agnostic. Tests substitute the in-memory
 * backend; the app uses the localStorage-backed implementation.
 */
export interface MaskedProbePreferencesRepoResult {
  status: StorageStatus;
}

export interface MaskedProbePreferencesRepo {
  load(): { preferences: MaskedProbePreferences | null; status: StorageStatus };
  save(preferences: MaskedProbePreferences): MaskedProbePreferencesRepoResult;
}

/**
 * localStorage-backed implementation. Falls back to status `"unavailable"`
 * (instead of throwing) when storage access fails; callers can then show
 * recoverable feedback without crashing the shell.
 */
export const createLocalStoragePreferencesRepo = (
  storageKey: string = MASKED_PROBE_PREFERENCE_STORAGE_KEY,
): MaskedProbePreferencesRepo => {
  const readStorage = (): Storage | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  };

  return {
    load() {
      const storage = readStorage();
      if (!storage) {
        return { preferences: null, status: "unavailable" };
      }
      try {
        const raw = storage.getItem(storageKey);
        if (!raw) {
          return { preferences: null, status: "ready" };
        }
        const parsed = JSON.parse(raw) as Partial<MaskedProbePreferences>;
        return {
          preferences: { ...DEFAULT_PREFERENCES, ...parsed },
          status: "ready",
        };
      } catch {
        // Corrupted persisted JSON is recoverable: surface the empty state
        // and let the user re-save. Returning unavailable keeps the UI
        // aware that persistence is currently broken.
        return { preferences: null, status: "unavailable" };
      }
    },
    save(preferences) {
      const storage = readStorage();
      if (!storage) {
        return { status: "unavailable" };
      }
      try {
        storage.setItem(storageKey, JSON.stringify(preferences));
        return { status: "ready" };
      } catch {
        return { status: "unavailable" };
      }
    },
  };
};

/**
 * In-memory implementation for tests and environments without localStorage
 * (jsdom by default allows configuration, and we want to avoid stubbing
 * global storage in every test).
 */
export const createInMemoryPreferencesRepo = (
  initial: MaskedProbePreferences | null = null,
): MaskedProbePreferencesRepo => {
  let store: MaskedProbePreferences | null = initial;
  let healthy = true;
  return {
    load() {
      return {
        preferences: store,
        status: store ? "ready" : healthy ? "ready" : "unavailable",
      };
    },
    save(preferences) {
      if (!healthy) {
        return { status: "unavailable" };
      }
      store = { ...preferences };
      return { status: "ready" };
    },
    // Test-only helpers, intentionally not part of the public interface.
    __setHealthy(next: boolean) {
      healthy = next;
    },
  } as MaskedProbePreferencesRepo & {
    __setHealthy?: (next: boolean) => void;
  };
};
