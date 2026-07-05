import { useEffect, useRef } from 'react';

import { StatusUtilityMaskedProbeControl } from './screens';
import { maskedProbeFixture } from './__fixtures__/masked-probe-control.fixture';
import {
  MaskedProbeProvider,
  useMaskedProbeStore,
} from './features/masked-probe-control/masked-probe-control.store';
import { registerStoreAccessor } from './test/bridge';

/**
 * Inner shell that runs inside the provider so the bridge can subscribe to
 * the live store and reflect state on `window.app`. Sibling stories read
 * `window.app` to coordinate navigation, selection, and telemetry.
 */
function AppShell() {
  const store = useMaskedProbeStore();
  // Keep a stable ref so the bridge always reads the freshest store without
  // re-registering on every render.
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    return registerStoreAccessor(() => storeRef.current);
  }, []);

  return (
    <div
      data-setfarm-root="app-shell"
      data-testid="setfarm-app-root"
      data-active-screen={store.state.activeScreenId}
      data-active-route={store.state.activeRoute}
      data-active-panel={store.state.activePanel}
      data-storage-status={store.state.storageStatus}
      className="min-h-screen bg-background text-on-surface"
    >
      <StatusUtilityMaskedProbeControl />
    </div>
  );
}

export default function App() {
  return (
    <MaskedProbeProvider initialRecords={[...maskedProbeFixture]}>
      <AppShell />
    </MaskedProbeProvider>
  );
}