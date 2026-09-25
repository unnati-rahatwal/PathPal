import React, { useState } from 'react';
import { MapPin, Navigation, Car, Bike, Footprints, Bus, Zap, ArrowUpDown, Sliders, ChevronDown, ChevronUp, Sun, ShieldAlert, AlertOctagon, Clock } from 'lucide-react';
import { MUMBAI_LOCATIONS, PRESET_ROUTES } from '../data/mumbaiData';

export default function RouteSelector({
  originId,
  setOriginId,
  destId,
  setDestId,
  travelMode,
  setTravelMode,
  activeProfile,
  setActiveProfile,
  preferences,
  setPreferences,
  onSelectPreset,
  onRecalculate
}) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [nightTime, setNightTime] = useState('12:00 AM');

  const TRAVEL_MODES = [
    { id: 'Auto/Cab', label: 'Cab / Auto', icon: Car },
    { id: 'Two-Wheeler', label: 'Two-Wheeler', icon: Bike },
    { id: 'Walking', label: 'Pedestrian', icon: Footprints },
    { id: 'Public Transit', label: 'Metro / Train', icon: Bus }
  ];

  const PROFILES = [
    { id: 'solo_female', label: 'Solo Female', icon: '👩' },
    { id: 'late_shift', label: 'Late Shift', icon: '💼' },
    { id: 'two_wheeler', label: 'Two-Wheeler', icon: '🛵' },
    { id: 'general', label: 'General', icon: '🌙' }
  ];

  const NIGHT_TIMES = [
    '10:00 PM',
    '12:00 AM (Midnight)',
    '02:00 AM (Late Night)',
    '04:00 AM (Dawn)'
  ];

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  const handlePrefChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="glass-panel p-5 border border-white/10 shadow-2xl rounded-2xl">
      {/* Header & Commuter Profile Selector */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wide">
          <Navigation className="w-4 h-4 text-cyan-400" />
          Night Journey Setup
        </h2>
        <div className="flex items-center gap-1 bg-[#050811] p-1 rounded-xl border border-white/5">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeProfile === p.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{p.icon}</span>
              <span className="hidden sm:inline ml-1">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start Location & Destination Search Inputs with Swap Button */}
      <div className="space-y-3 mb-4 relative">
        {/* Start Location */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#10B981]" />
            Start Location (Origin)
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#060a14] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer shadow-inner"
            >
              {MUMBAI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === destId}>
                  {loc.name} — {loc.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button Floating Center */}
        <div className="flex justify-center -my-1 z-10 relative">
          <button
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-[#0d1527] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#00F0FF]" />
            Destination
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#060a14] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer shadow-inner"
            >
              {MUMBAI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === originId}>
                  {loc.name} — {loc.category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Travel Mode & Night Time Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Travel Mode */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">
            Travel Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {TRAVEL_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = travelMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-[#060a14] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Night Time Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Time of Night
          </label>
          <select
            value={nightTime}
            onChange={(e) => setNightTime(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#060a14] border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {NIGHT_TIMES.map((time, idx) => (
              <option key={idx} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1 block uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Popular Mumbai Night Routes
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_ROUTES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-[#060a14] hover:bg-white/10 border border-white/5 text-[11px] text-slate-300 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
            >
              <span className="text-cyan-400 font-bold">➔</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Toggle for Fine-Tuning Preferences */}
      <div className="border-t border-white/5 pt-3">
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Fine-Tune Personal Safety Parameters
          </span>
          {showPreferences ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showPreferences && (
          <div className="mt-3 space-y-3 bg-[#060a14] p-3 rounded-xl border border-white/5 animate-fade-in">
            {/* Safety Weight Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-amber-400">⚡ Speed Priority</span>
                <span className="text-emerald-400">🛡️ Safety Weight: {preferences.safetyPriority}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={preferences.safetyPriority}
                onChange={(e) => handlePrefChange('safetyPriority', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Toggle Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handlePrefChange('lightPreference', !preferences.lightPreference)}
                className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-all ${
                  preferences.lightPreference
                    ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> Lit Roads
                </span>
                <span>{preferences.lightPreference ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handlePrefChange('preferPoliceChowkis', !preferences.preferPoliceChowkis)}
                className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-all ${
                  preferences.preferPoliceChowkis
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-emerald-400" /> Police Chowkis
                </span>
                <span>{preferences.preferPoliceChowkis ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handlePrefChange('avoidIsolated', !preferences.avoidIsolated)}
                className={`p-2 rounded-lg border text-[11px] font-semibold flex items-center justify-between transition-all ${
                  preferences.avoidIsolated
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3 text-cyan-400" /> Bypass Dark Alleys
                </span>
                <span>{preferences.avoidIsolated ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recalculate Button */}
      <button
        onClick={onRecalculate}
        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all active:scale-[0.99]"
      >
        <Navigation className="w-4 h-4 fill-current" />
        <span>Calculate Optimal Safe Corridors</span>
      </button>
    </div>
  );
}
