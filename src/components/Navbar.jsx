import React from 'react';
import {
  Shield,
  Moon,
  PhoneCall,
  AlertTriangle,
  Compass,
  MessageSquare,
  ShieldCheck,
  Home,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSOS,
  onOpenReportModal,
  mumbaiTime
}) {
  const NAV_TABS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Route Planner & Map', icon: Compass },
    { id: 'inspector', label: 'Safety Inspector', icon: ShieldCheck },
    { id: 'community', label: 'Live Night Feed', icon: MessageSquare }
  ];

  return (
    <header className="w-full bg-[#090d18]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-[1100] px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105">
            <div className="w-full h-full bg-[#050811] rounded-[14px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              PATHPAL
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 tracking-wider">
                MUMBAI NIGHTSAFE
              </span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
              AI-Powered Night-Time Route Planning Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation Links */}
        <nav className="flex items-center gap-1 bg-[#050811] p-1 rounded-2xl border border-white/10 shadow-inner">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-400/40 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Live Clock */}
        <div className="flex items-center gap-3">
          {/* Live Mumbai Time Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono shadow-sm">
            <span className="live-dot" />
            <Moon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mumbai {mumbaiTime}</span>
          </div>

          {/* Submit Live Report */}
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>+ Submit Live Report</span>
          </button>

          {/* SOS Guard Emergency Button */}
          <button
            onClick={onOpenSOS}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>SOS Guard</span>
          </button>
        </div>
      </div>
    </header>
  );
}
