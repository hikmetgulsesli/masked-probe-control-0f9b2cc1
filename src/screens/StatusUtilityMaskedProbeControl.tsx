// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Status Utility - Masked Probe Control
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import { Clock, Cpu, Gauge, HeartPulse, Network, RefreshCw, Settings } from "lucide-react";


export type StatusUtilityMaskedProbeControlActionId = "refresh-1" | "settings-2" | "refresh-telemetrics-3";

export interface StatusUtilityMaskedProbeControlProps {
  actions?: Partial<Record<StatusUtilityMaskedProbeControlActionId, () => void>>;

}

export function StatusUtilityMaskedProbeControl({ actions }: StatusUtilityMaskedProbeControlProps) {
  return (
    <>
      {/* TopAppBar */}
      <header className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline-variant flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-unit h-14 shrink-0 fixed top-0 z-50">
      <div className="flex items-center gap-2">
      <Network className="text-primary" aria-hidden={true} focusable="false" />
      <h1 className="font-headline-sm text-headline-sm font-semibold text-primary dark:text-primary tracking-tight">Masked Probe Control</h1>
      </div>
      <div className="flex items-center gap-4 hidden"> {/* Hidden search bar as per JSON */}
      <input className="bg-surface-container-high border-outline-variant rounded px-3 py-1 text-on-surface focus:outline-none focus:border-primary" placeholder="Search..." type="text" />
      </div>
      <div className="flex items-center gap-3">
      <button aria-label="refresh" className="p-2 hover:bg-surface-container-high dark:hover:bg-surface-container-high transition-colors rounded text-on-surface-variant dark:text-on-surface-variant active:scale-95 duration-150 group" type="button" data-action-id="refresh-1" onClick={actions?.["refresh-1"]}>
      <RefreshCw className="group-hover:text-primary transition-colors" aria-hidden={true} focusable="false" />
      </button>
      <button aria-label="settings" className="p-2 hover:bg-surface-container-high dark:hover:bg-surface-container-high transition-colors rounded text-on-surface-variant dark:text-on-surface-variant active:scale-95 duration-150 group" type="button" data-action-id="settings-2" onClick={actions?.["settings-2"]}>
      <Settings className="group-hover:text-primary transition-colors" aria-hidden={true} focusable="false" />
      </button>
      </div>
      </header>
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center pt-14 p-margin-mobile md:p-margin-desktop relative overflow-hidden">
      {/* Background Grid Pattern for Technical Feel */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      {/* Utility Panel */}
      <div className="relative w-full max-w-3xl bg-surface-container border border-outline-variant rounded-xl shadow-2xl p-6 md:p-8 flex flex-col gap-8 z-10 backdrop-blur-sm bg-opacity-95">
      {/* Panel Header & Status Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-outline-variant">
      <div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-1">System Status</h2>
      <p className="font-body-md text-body-md text-on-surface-variant">Real-time telemetrics and probe diagnostics.</p>
      </div>
      <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2 rounded-lg border border-outline-variant">
      <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">System Status</span>
      <label className="relative inline-flex items-center cursor-pointer">
      <input defaultChecked={true} className="sr-only peer" id="systemToggle" type="checkbox" />
      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
      <span className="ml-3 font-technical-sm text-technical-sm text-primary" id="toggleLabel">Ready</span>
      </label>
      </div>
      </div>
      {/* Telemetrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Health */}
      <div className="bg-surface border border-outline-variant rounded-lg p-5 flex flex-col gap-2 hover:border-primary transition-colors duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex items-center gap-2 mb-1">
      <HeartPulse data-weight="fill" className="text-primary text-[20px]" aria-hidden={true} focusable="false" />
      <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Probe Health</h3>
      </div>
      <div className="flex items-end gap-2">
      <span className="font-headline-lg text-headline-lg text-on-surface">100</span>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant mb-1">%</span>
      </div>
      <div className="w-full bg-surface-variant h-1 mt-2 rounded-full overflow-hidden">
      <div className="bg-primary h-full rounded-full w-full"></div>
      </div>
      </div>
      {/* Card 2: Latency */}
      <div className="bg-surface border border-outline-variant rounded-lg p-5 flex flex-col gap-2 hover:border-primary transition-colors duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex items-center gap-2 mb-1">
      <Gauge data-weight="fill" className="text-primary text-[20px]" aria-hidden={true} focusable="false" />
      <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Network Latency</h3>
      </div>
      <div className="flex items-end gap-2">
      <span className="font-headline-lg text-headline-lg text-on-surface">12</span>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant mb-1">ms</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant">Optimal connection</span>
      </div>
      </div>
      {/* Card 3: Load */}
      <div className="bg-surface border border-outline-variant rounded-lg p-5 flex flex-col gap-2 hover:border-primary transition-colors duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex items-center gap-2 mb-1">
      <Cpu data-weight="fill" className="text-primary text-[20px]" aria-hidden={true} focusable="false" />
      <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">System Load</h3>
      </div>
      <div className="flex items-end gap-2">
      <span className="font-headline-lg text-headline-lg text-on-surface">4</span>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant mb-1">%</span>
      </div>
      <div className="w-full bg-surface-variant h-1 mt-2 rounded-full overflow-hidden flex">
      <div className="bg-primary h-full rounded-l-full w-[4%]"></div>
      <div className="bg-transparent h-full w-[96%]"></div>
      </div>
      </div>
      </div>
      {/* Controls & Feedback */}
      <div className="flex flex-col gap-6 mt-4">
      {/* Timestamp Display */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-outline-variant">
      <div className="flex items-center gap-3">
      <Clock className="text-on-surface-variant" aria-hidden={true} focusable="false" />
      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Current Sync Time</span>
      </div>
      <div className="font-technical-md text-technical-md text-primary tracking-widest bg-surface-container-high px-3 py-1 rounded border border-outline-variant/50 shadow-inner" id="timestampDisplay">
                              --:--:--.---
                          </div>
      </div>
      {/* Action Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant">
      <div className="flex flex-col gap-1 w-full sm:w-auto">
      <button className="bg-primary-container hover:bg-primary text-on-primary-container font-body-md font-semibold py-2.5 px-6 rounded DEFAULT flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-lg shadow-primary-container/20" id="refreshBtn" type="button" data-action-id="refresh-telemetrics-3" onClick={actions?.["refresh-telemetrics-3"]}>
      <RefreshCw className="text-[18px]" aria-hidden={true} focusable="false" />
                                  Refresh Telemetrics
                              </button>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant opacity-70 mt-1 pl-1" id="lastUpdateText">Last Update: Pending...</span>
      </div>
      {/* Feedback Console */}
      <div className="w-full sm:w-auto bg-surface-container-lowest border border-outline-variant rounded p-3 min-w-[200px] flex items-center gap-2 h-[48px]">
      <span className="w-2 h-2 rounded-full bg-primary inline-block" id="statusIndicator"></span>
      <span className="font-technical-sm text-technical-sm text-on-surface-variant" id="feedbackMessage">Local state active</span>
      </div>
      </div>
      </div>
      </div>
      </main>
      
    </>
  );
}
