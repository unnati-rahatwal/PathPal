import React from 'react';
import { Sliders, Sun, ShieldAlert, Store, AlertOctagon } from 'lucide-react';

export default function PreferenceTuner({ preferences, setPreferences }) {
  const handleChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Personal Comfort & Safety Preferences
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          SAFETY WEIGHT: {preferences.safetyPriority}%
        </span>
      </div>

      <div className="space-y-3">
        {/* Safety vs Speed Weight Slider */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
            <span className="text-amber-400">⚡ Prioritize Speed</span>
            <span className="text-emerald-400">🛡️ Prioritize Maximum Safety</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={preferences.safetyPriority}
            onChange={(e) => handleChange('safetyPriority', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5">
          {/* Streetlight Preference */}
          <button
            onClick={() => handleChange('lightPreference', !preferences.lightPreference)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
              preferences.lightPreference
                ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                : 'bg-[#0d1322] border-white/5 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Lit Arterial Roads</span>
            </div>
            <span className="text-[10px] font-bold">{preferences.lightPreference ? 'ON' : 'OFF'}</span>
          </button>

          {/* Prefer Police & Pink Booths */}
          <button
            onClick={() => handleChange('preferPoliceChowkis', !preferences.preferPoliceChowkis)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
              preferences.preferPoliceChowkis
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                : 'bg-[#0d1322] border-white/5 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Near Police Chowkis</span>
            </div>
            <span className="text-[10px] font-bold">{preferences.preferPoliceChowkis ? 'ON' : 'OFF'}</span>
          </button>

          {/* Avoid Isolated Stretches */}
          <button
            onClick={() => handleChange('avoidIsolated', !preferences.avoidIsolated)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
              preferences.avoidIsolated
                ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300'
                : 'bg-[#0d1322] border-white/5 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bypass Dark Alleys</span>
            </div>
            <span className="text-[10px] font-bold">{preferences.avoidIsolated ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
