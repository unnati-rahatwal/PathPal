import React, { useState } from 'react';
import {
  Navigation,
  ArrowUpDown,
  Sun,
  Shield,
  Fuel,
  Sliders,
  Sparkles,
  Eye,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers
} from 'lucide-react';
import LocationSearchInput from '../LocationSearchInput';
import MapView from '../MapView';

export default function RoutePlanner({
  originLocation,
  setOriginLocation,
  destLocation,
  setDestLocation,
  travelMode,
  setTravelMode,
  activeProfile,
  setActiveProfile,
  preferences,
  setPreferences,
  routes,
  selectedRouteId,
  setSelectedRouteId,
  isLoadingRoutes,
  liveOSMNodes,
  reports,
  onRecalculate,
  onInspectRoute
}) {
  const [nightTime, setNightTime] = useState('12:00 AM');
  const [showPreferences, setShowPreferences] = useState(false);

  const NIGHT_TIMES = ['10:00 PM', '12:00 AM', '02:00 AM', '04:00 AM'];

  const handleSwap = () => {
    const temp = originLocation;
    setOriginLocation(destLocation);
    setDestLocation(temp);
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="pt-16 h-screen flex flex-col overflow-hidden bg-[#0d0630]">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ── LEFT PANEL (Inputs, Sliders, Route Options) ── */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#18314f] border-r border-[#8bbeb2]/15 flex flex-col h-full overflow-hidden z-20">
          <div className="overflow-y-auto flex-1 divide-y divide-[#8bbeb2]/10 scrollbar-thin">
            {/* Input Section */}
            <div className="p-4 sm:p-5 space-y-3.5 bg-[#18314f]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]">
                  Mumbai Night Corridor
                </span>
                <span className="text-[11px] text-[#e6f9af] font-mono font-bold">
                  {nightTime}
                </span>
              </div>

              {/* Origin Search */}
              <LocationSearchInput
                label="Start Location (Origin)"
                value={originLocation}
                onChange={setOriginLocation}
                color="emerald"
                placeholder="Search pickup point, building or station..."
                excludeId={destLocation?.id}
              />

              {/* Swap Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-7 h-7 rounded-full bg-[#0d0630] border border-[#8bbeb2]/30 text-[#8bbeb2] hover:text-[#e6f9af] hover:border-[#8bbeb2] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                  title="Swap Origin & Destination"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Destination Search */}
              <LocationSearchInput
                label="Destination (Target)"
                value={destLocation}
                onChange={setDestLocation}
                color="cyan"
                placeholder="Search drop-off landmark, society, hub..."
                excludeId={originLocation?.id}
              />

              {/* Time Chips */}
              <div className="pt-2 flex items-center justify-between gap-1.5 overflow-x-auto">
                <span className="text-[10px] text-[#8bbeb2]/60 uppercase tracking-wider font-bold">Time:</span>
                <div className="flex gap-1">
                  {NIGHT_TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setNightTime(time)}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        nightTime === time
                          ? 'bg-[#e6f9af]/15 border-[#e6f9af] text-[#e6f9af] font-bold'
                          : 'bg-[#0d0630]/40 border-[#8bbeb2]/15 text-[#8bbeb2]/60 hover:text-[#8bbeb2]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety Weight Sliders */}
            <div className="p-4 sm:p-5 space-y-3 bg-[#18314f]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]/70 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#8bbeb2]" />
                  Safety Parameters
                </span>
                <span className="text-[11px] font-bold text-[#e6f9af]">
                  Weight: {preferences.safetyPriority}%
                </span>
              </div>

              <div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={preferences.safetyPriority}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, safetyPriority: Number(e.target.value) }))
                  }
                  className="w-full h-1.5 bg-[#0d0630] rounded-lg appearance-none cursor-pointer accent-[#8bbeb2]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, lightPreference: !prev.lightPreference }))
                  }
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    preferences.lightPreference
                      ? 'bg-[#8bbeb2]/20 border-[#8bbeb2] text-[#e6f9af]'
                      : 'bg-[#0d0630]/50 border-white/5 text-[#8bbeb2]/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-300" /> Lit Roads
                  </span>
                  <span>{preferences.lightPreference ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      preferPoliceChowkis: !prev.preferPoliceChowkis
                    }))
                  }
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    preferences.preferPoliceChowkis
                      ? 'bg-[#8bbeb2]/20 border-[#8bbeb2] text-[#e6f9af]'
                      : 'bg-[#0d0630]/50 border-white/5 text-[#8bbeb2]/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-300" /> Police Beats
                  </span>
                  <span>{preferences.preferPoliceChowkis ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Computed Route Options */}
            <div className="p-4 sm:p-5 space-y-3 bg-[#18314f]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]/70">
                  Calculated Corridors ({routes.length})
                </span>
                {isLoadingRoutes && (
                  <span className="text-[10px] text-[#e6f9af] animate-pulse">
                    Computing OSMnx...
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {routes.map((route) => {
                  const isSelected = selectedRouteId === route.id;
                  const isSafest = route.id === 'safest';
                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#384e77]/40 border-[#8bbeb2]/70 shadow-lg'
                          : 'bg-[#0d0630]/50 border-[#8bbeb2]/10 hover:border-[#8bbeb2]/30'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#e6f9af] rounded-r" />
                      )}

                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSafest
                              ? 'bg-[#e6f9af] text-[#0d0630]'
                              : 'bg-[#384e77] text-[#8bbeb2]'
                          }`}
                        >
                          {isSafest ? 'Safest Choice' : route.title}
                        </span>
                        <span
                          className="font-serif text-lg font-bold"
                          style={{ color: route.color || '#e6f9af' }}
                        >
                          {route.safetyScore}/100
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#e6f9af] mb-1">{route.title}</div>
                      <div className="text-[11px] text-[#8bbeb2]/70 flex items-center justify-between">
                        <span>⏱️ {route.etaMinutes} mins</span>
                        <span>🛣️ {route.distanceKm} km</span>
                        <span>💡 {route.lightingScore || 90}% Lit</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inspect Button */}
              {selectedRoute && (
                <button
                  type="button"
                  onClick={() => onInspectRoute && onInspectRoute(selectedRoute)}
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#8bbeb2] to-[#e6f9af] text-[#0d0630] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-all cursor-pointer"
                >
                  <span>Deep Inspect Corridor</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Interactive Leaflet Map ── */}
        <div className="lg:col-span-7 xl:col-span-8 h-full relative">
          <MapView
            routes={routes}
            selectedRouteId={selectedRouteId}
            setSelectedRouteId={setSelectedRouteId}
            originLocation={originLocation}
            destLocation={destLocation}
            liveOSMNodes={liveOSMNodes}
            isLoadingRoutes={isLoadingRoutes}
            reports={reports}
          />
        </div>
      </div>
    </div>
  );
}
