import { useEffect } from "react";
import {
  MaskedProbeStoreProvider,
  useMaskedProbeStore,
} from "./features/masked-probe-control/masked-probe-control.store";
import { StatusUtilityMaskedProbeControl } from "./screens";
import { registerStoreAccessor } from "./test/bridge";

/**
 * Inner shell mounted under the store provider. Registers the live
 * accessor with the test bridge so `window.app` always reads from the
 * current store instance, then renders the visible screen.
 *
 * App-level chrome (refresh, settings, refresh-telemetrics) is rendered
 * here so the harness and sibling stories always have a stable entry
 * point. When the screen-owner story ships its real layout it can take
 * over these actions, but the data-action-id contract stays put.
 */
const AppShell = () => {
  const store = useMaskedProbeStore();

  useEffect(() => {
    registerStoreAccessor(() => store);
    return () => registerStoreAccessor(() => null);
  }, [store]);

  return (
    <div
      data-setfarm-root="baseline"
      data-testid="setfarm-app-root"
      className="min-h-screen bg-slate-50 text-slate-950"
    >
      <header
        data-testid="setfarm-app-chrome"
        className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3"
      >
        <button
          type="button"
          data-action-id="refresh-1"
          data-testid="setfarm-action-refresh"
          onClick={() => store.refreshTelemetry()}
          className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          refresh
        </button>
        <button
          type="button"
          data-action-id="settings-2"
          data-testid="setfarm-action-settings"
          onClick={() => store.navigate("/settings", "settings-screen")}
          className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          settings
        </button>
        <button
          type="button"
          data-action-id="refresh-telemetrics-3"
          data-testid="setfarm-action-refresh-telemetrics"
          onClick={() => store.refreshTelemetry()}
          className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Refresh Telemetrics
        </button>
      </header>
      <StatusUtilityMaskedProbeControl
        actions={{
          navigate: store.navigate,
          selectRecord: store.selectRecord,
          setPanel: store.setPanel,
          upsertRecord: store.upsertRecord,
          removeRecord: store.removeRecord,
          setPreference: store.setPreference,
          resetPreferences: store.resetPreferences,
          refreshTelemetry: store.refreshTelemetry,
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <MaskedProbeStoreProvider>
      <AppShell />
    </MaskedProbeStoreProvider>
  );
}