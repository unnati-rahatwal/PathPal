import React from 'react';
import {
  Shield,
  Navigation,
  Compass,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Zap,
  Moon,
  Users,
  Eye,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Activity,
  Radio
} from 'lucide-react';

export default function LandingHero({
  onLaunchPlanner,
  onOpenSOS,
  onOpenReportModal,
  mumbaiTime
}) {
  const STATS = [
    { label: 'Verified Safe Corridors', value: '100%', detail: 'Mumbai-wide spatial mapping', color: 'text-cyan-400' },
    { label: 'Active Police Beats', value: '45+', detail: '24/7 Division chowki sync', color: 'text-emerald-400' },
    { label: 'Verified Safe Havens', value: '120+', detail: 'Petrol pumps, hospitals & QSRs', color: 'text-amber-400' },
    { label: 'Live Commuter Feed', value: '< 2m', detail: 'Real-time incident updates', color: 'text-indigo-400' }
  ];

  const FEATURES = [
    {
      icon: ShieldCheck,
      title: 'Multi-Criteria Safety Engine',
      description: 'Algorithms calculate route corridors based on street lighting intensity, police density, crowd footfall, and proximity to 24/7 safe havens.',
      gradient: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30 text-cyan-400'
    },
    {
      icon: Compass,
      title: 'Live GIS Vector Night Map',
      description: 'Interactive dark canvas map powered by OpenStreetMap Overpass live data, streetlight halos, and active hazard alerts.',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30 text-emerald-400'
    },
    {
      icon: PhoneCall,
      title: '1-Tap Emergency SOS Guard',
      description: 'Instant panic countdown, live location broadcast simulation, emergency speed-dial to 112/103/100, and nearest safe haven navigation.',
      gradient: 'from-rose-500/20 to-red-500/10',
      borderColor: 'border-rose-500/30 text-rose-400'
    },
    {
      icon: Users,
      title: 'Crowdsourced Night Feed',
      description: 'Community alerts verified by fellow commuters for unlit alleys, active police check-posts, and safe late-night transit points.',
      gradient: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/30 text-purple-400'
    }
  ];

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b1224] via-[#070c1a] to-[#050811] border border-white/10 p-8 lg:p-12 shadow-2xl">
        {/* Decorative Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-inner">
            <span className="live-dot" />
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>PathPal • AI-Powered Night Safety Navigation for Commuters</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Navigate Mumbai at Night with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
              Uncompromising Safety
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            The intelligent route planner designed for solo commuters, late-shift workers, and night travelers. 
            Real-time streetlight coverage, police density, verified safe havens, and community hazard alerts.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={onLaunchPlanner}
              className="px-8 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Navigation className="w-5 h-5 text-slate-950 fill-current" />
              <span>Launch Route Planner</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            <button
              onClick={onOpenSOS}
              className="px-6 py-4 rounded-2xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/50 text-rose-200 font-extrabold text-sm flex items-center gap-2.5 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Emergency SOS Guard</span>
            </button>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-3 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Free OpenStreetMap Live Integration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              No Registration Needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              24/7 Mumbai Police Chowki Sync
            </span>
          </div>
        </div>
      </section>

      {/* Stats Grid Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 text-center border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
          >
            <div className={`text-2xl lg:text-3xl font-black ${stat.color} mb-1 group-hover:scale-105 transition-transform`}>
              {stat.value}
            </div>
            <div className="text-xs font-extrabold text-white uppercase tracking-wide mb-0.5">
              {stat.label}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {stat.detail}
            </div>
          </div>
        ))}
      </section>

      {/* Features Showcase Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
            <Radio className="w-4 h-4 animate-pulse" />
            Safety Technology Built for Commuters
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Why Commuters Rely on PathPal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Standard map engines optimize only for distance and traffic. PathPal factors in street lighting, crime telemetry, footfall, and police chowkis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`glass-panel p-6 border ${feat.borderColor} bg-gradient-to-b ${feat.gradient} hover:scale-[1.02] transition-all duration-300 space-y-4`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#090e1d] border border-white/10 flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box Banner */}
      <section className="glass-panel p-8 lg:p-10 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#070c1a] to-emerald-950/40 rounded-3xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Ready to plan your safest late-night journey?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Select your starting location, destination, travel mode, and personal safety preferences to compute the top 3 corridors instantly.
          </p>
        </div>
        <button
          onClick={onLaunchPlanner}
          className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-400/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Navigation className="w-4 h-4 text-slate-950 fill-current" />
          <span>Start Route Planning</span>
        </button>
      </section>
    </div>
  );
}
