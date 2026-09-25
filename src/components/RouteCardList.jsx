import React from 'react';
import { ShieldCheck, Clock, Navigation2, Sun, Users, Shield, Check, AlertTriangle, ChevronRight } from 'lucide-react';

export default function RouteCardList({
  routes,
  selectedRouteId,
  setSelectedRouteId
}) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
          Recommended Night Corridors ({routes.length})
        </h3>
        <span className="text-[10px] text-slate-400">Select card to focus map</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          
          let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          if (route.id === 'balanced') badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
          if (route.id === 'fastest') badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`glass-panel p-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-400/80 ring-1 ring-cyan-400/50 bg-[#121c30] shadow-xl'
                  : 'hover:border-white/20 hover:bg-[#0f1729]'
              }`}
            >
              {/* Selected indicator bar */}
              {isSelected && (
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: route.color }}
                />
              )}

              {/* Badge & Title */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeBg}`}>
                  {route.badge}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {route.distanceKm} km
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: route.color }}
                />
                {route.title}
              </h4>
              <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">{route.subtitle}</p>

              {/* Safety Score Meter */}
              <div className="bg-[#0b101d] p-2.5 rounded-xl border border-white/5 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Safety Score
                  </span>
                  <span className="text-sm font-extrabold font-mono text-white">
                    {route.safetyScore}
                    <span className="text-[10px] text-slate-400 font-normal">/100</span>
                  </span>
                </div>
                {/* Score Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${route.safetyScore}%`,
                      backgroundColor: route.color
                    }}
                  />
                </div>
              </div>

              {/* Key Metrics grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-white/5 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    ETA
                  </span>
                  <span className="font-bold text-slate-100">{route.etaMinutes} mins</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" />
                    Light
                  </span>
                  <span className="font-bold text-slate-100">{route.metrics.lightingCoverage}</span>
                </div>
              </div>

              {/* Highlights & Hazards preview */}
              <div className="space-y-1 text-[11px]">
                {route.highlights.slice(0, 2).map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
                {route.hazardWarnings.length > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-300 pt-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{route.hazardWarnings[0]}</span>
                  </div>
                )}
              </div>

              {/* Select Callout */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
                <span>{isSelected ? 'Currently Selected' : 'Tap to Select Route'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
