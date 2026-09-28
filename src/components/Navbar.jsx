import React from 'react';
import { Shield, AlertCircle, PhoneCall, Sparkles, Navigation, MapPin } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSOS,
  backendStatus
}) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'Route Planner' },
    { id: 'detail', label: 'Route Detail' },
    { id: 'howItWorks', label: 'How It Works' },
    { id: 'tourist', label: 'Tourist Mode' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'report', label: 'Report Hazard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-[#0d0630]/90 backdrop-blur-md border-b border-[#8bbeb2]/15">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className="font-serif text-xl lg:text-2xl font-black italic text-[#e6f9af] tracking-tight hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span>NightPath</span>
          <span className="text-[#8bbeb2]">.</span>
        </button>

        {/* Backend Connectivity Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18314f]/80 border border-[#8bbeb2]/20 text-[11px] text-[#8bbeb2]">
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus?.connected ? 'bg-[#e6f9af] shadow-[0_0_8px_#e6f9af]' : 'bg-amber-400'
            }`}
          />
          <span className="font-mono">
            {backendStatus?.connected
              ? `OSM Live (${(backendStatus.nodes / 1000).toFixed(0)}k nodes)`
              : 'Connecting Backend...'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className="hidden xl:flex items-center gap-6 list-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`text-[12px] font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#e6f9af] font-bold border-b border-[#e6f9af] pb-0.5'
                    : 'text-[#8bbeb2]/70 hover:text-[#e6f9af]'
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Dropdown for Tab Navigation */}
        <div className="xl:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-[#18314f] text-[#e6f9af] text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#8bbeb2]/20 focus:outline-none"
          >
            {navItems.map((it) => (
              <option key={it.id} value={it.id}>
                {it.label}
              </option>
            ))}
          </select>
        </div>

        {/* Emergency SOS Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          title="Emergency Police & SOS Dispatch"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="hidden sm:inline">NIGHT SOS</span>
        </button>

        {/* Launch Planner Action CTA */}
        {activeTab !== 'planner' ? (
          <button
            onClick={() => setActiveTab('planner')}
            className="px-4 py-1.5 rounded-full bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            Plan Route
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('onboarding')}
            className="px-4 py-1.5 rounded-full bg-transparent hover:bg-[#8bbeb2]/10 text-[#8bbeb2] border border-[#8bbeb2]/30 text-xs font-medium transition-all cursor-pointer"
          >
            Onboarding
          </button>
        )}
      </div>
    </nav>
  );
}
