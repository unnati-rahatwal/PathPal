import React from 'react';
import { Shield, Moon, PhoneCall, AlertTriangle, Sparkles, Navigation } from 'lucide-react';

export default function Header({
  activeProfile,
  setActiveProfile,
  onOpenSOS,
  onOpenReportModal,
  mumbaiTime
}) {
  const PROFILES = [
    { id: 'solo_female', label: 'Solo Female Commuter', icon: '👩' },
    { id: 'late_shift', label: 'Late Shift Worker', icon: '💼' },
    { id: 'two_wheeler', label: 'Two-Wheeler Commuter', icon: '🛵' },
    { id: 'general', label: 'General Night Commuter', icon: '🌙' }
  ];

  return (
    <header className="w-full glass-panel px-5 py-3.5 mb-5 flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-2xl">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/25">
          <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              BALIKAMAN
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10">
                Mumbai NightSafe v2.4
              </span>
            </h1>
          </div>
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-emerald-400 inline" />
            Safety & Comfort Route Optimization Engine
          </p>
        </div>
      </div>

      {/* Profile Persona Switcher */}
      <div className="flex items-center gap-1.5 bg-[#0a0f1d] p-1.5 rounded-2xl border border-white/5 shadow-inner">
        {PROFILES.map((profile) => {
          const isActive = activeProfile === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/25 to-emerald-500/25 text-cyan-300 border border-cyan-400/40 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{profile.icon}</span>
              <span className="hidden md:inline">{profile.label}</span>
            </button>
          );
        })}
      </div>

      {/* Clock & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Live Mumbai Time Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
          <span className="live-dot" />
          <Moon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono">Mumbai {mumbaiTime}</span>
        </div>

        {/* Community Hazard Report */}
        <button
          onClick={onOpenReportModal}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Report Hazard</span>
        </button>

        {/* SOS Guard Emergency Trigger */}
        <button
          onClick={onOpenSOS}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-red-600/35 transition-all active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>SOS Guard</span>
        </button>
      </div>
    </header>
  );
}
