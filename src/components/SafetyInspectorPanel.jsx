import React from 'react';
import { ShieldCheck, Sun, Users, Shield, Eye, AlertOctagon, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SafetyInspectorPanel({ selectedRoute, originName, destName }) {
  if (!selectedRoute) return null;

  const metricsList = [
    {
      label: 'Streetlight & Visibility',
      val: selectedRoute.metrics.lightingCoverage,
      icon: Sun,
      color: 'text-amber-400'
    },
    {
      label: 'Commercial & Night Footfall',
      val: selectedRoute.metrics.footfallActivity,
      icon: Users,
      color: 'text-cyan-400'
    },
    {
      label: 'Police & Pink Booth Proximity',
      val: selectedRoute.metrics.policeProximity,
      icon: Shield,
      color: 'text-emerald-400'
    },
    {
      label: 'Isolation & Shadow Index',
      val: selectedRoute.metrics.isolationIndex,
      icon: AlertOctagon,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: selectedRoute.color }}
            />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Route Safety Inspector: {selectedRoute.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed night environmental breakdown from {originName} to {destName}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Safety Index: {selectedRoute.safetyScore}/100
          </span>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {metricsList.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-[#0b101c] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="truncate">{m.label}</span>
              </div>
              <div className="text-base font-extrabold font-mono text-white">{m.val}</div>
            </div>
          );
        })}
      </div>

      {/* Turn-by-Turn Safety Guidance & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Safety Features */}
        <div className="bg-[#0c1220] p-3.5 rounded-xl border border-white/5">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Safety Features Along Corridor
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {selectedRoute.highlights.map((hl, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hazard Warnings or Commuter Advice */}
        <div className="bg-[#0c1220] p-3.5 rounded-xl border border-white/5">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            Commuter Advisories & Shadow Zones
          </h4>
          {selectedRoute.hazardWarnings.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedRoute.hazardWarnings.map((hw, i) => (
                <li key={i} className="flex items-start gap-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-amber-200">
                  <span className="text-amber-400 font-bold">⚠️</span>
                  <span>{hw}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero high-risk shadow zones detected on this primary corridor. Excellent for late night travel.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
