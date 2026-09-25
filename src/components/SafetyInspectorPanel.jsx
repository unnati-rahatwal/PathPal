import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sun, Users, Shield, Eye, AlertOctagon, Compass, CheckCircle2, ChevronRight, Camera, Loader2, ExternalLink } from 'lucide-react';
import { fetchGoogleStreetViewPreview } from '../services/apiService';

export default function SafetyInspectorPanel({ selectedRoute, originName, destName }) {
  const [streetView, setStreetView] = useState(null);
  const [isLoadingStreetView, setIsLoadingStreetView] = useState(false);

  const destCoords = selectedRoute?.waypoints?.[selectedRoute.waypoints.length - 1];

  useEffect(() => {
    if (!destCoords || destCoords.length < 2) return;
    const [lat, lng] = destCoords;

    setIsLoadingStreetView(true);
    fetchGoogleStreetViewPreview(lat, lng)
      .then((res) => {
        if (res && res.preview) {
          setStreetView(res.preview);
        }
        setIsLoadingStreetView(false);
      })
      .catch(() => {
        setIsLoadingStreetView(false);
      });
  }, [destCoords]);

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

      {/* Destination Drop-Off & Street-Level Night Inspection (Google Street View) */}
      <div className="mt-4 bg-[#080d1a] p-4 rounded-xl border border-cyan-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Drop-Off Street View & Night Lighting Verification
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Destination: {destName}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Visual inspection of the arrival junction, drop-off lighting, and building storefronts before commuter departure.
        </p>

        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#04060c] aspect-video sm:aspect-[21/9] flex items-center justify-center">
          {isLoadingStreetView ? (
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading Google Street View inspection...</span>
            </div>
          ) : streetView?.available && streetView?.image_url ? (
            <div className="w-full h-full relative group">
              <img
                src={streetView.image_url}
                alt={`Street View of ${destName}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Google Street View
                  </span>
                  {streetView.capture_date && (
                    <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      Captured: {streetView.capture_date}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-white flex items-center justify-between">
                  <span>{destName} Drop-off Junction</span>
                  <span className="text-cyan-300 text-[10px] font-mono">
                    {destCoords?.[0]?.toFixed(4)}°N, {destCoords?.[1]?.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-xs font-bold text-slate-200">
                Street View Visual Inspector for {destName}
              </div>
              <div className="text-[10px] text-slate-400 max-w-sm mx-auto">
                Coordinates: {destCoords?.[0]?.toFixed(4) ?? '19.0178'}°N, {destCoords?.[1]?.toFixed(4) ?? '72.8478'}°E • Street lighting: <span className="text-emerald-400 font-bold">{selectedRoute.metrics.lightingCoverage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
