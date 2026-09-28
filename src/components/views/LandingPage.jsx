import React, { useState } from 'react';
import {
  Shield,
  Sun,
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Eye,
  Building,
  Users,
  Briefcase,
  Compass,
  ArrowRight,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage({ onLaunchPlanner, onNavigate }) {
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (onLaunchPlanner) onLaunchPlanner();
  };

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center px-6 lg:px-16 py-12 overflow-hidden bg-[#0d0630]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-[#384e77]/30 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#8bbeb2]/10 blur-[100px] pointer-events-none" />

        {/* Hero Grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,190,178,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,190,178,0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18314f] border border-[#8bbeb2]/25 text-xs font-semibold text-[#8bbeb2] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#e6f9af] animate-ping inline-block" />
              Smarter Routes After Dark • Mumbai NightSafe
            </div>

            <h1
              className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#e6f9af] leading-[1.08]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Don’t just take the fastest route. <br />
              Take the <em className="text-[#8bbeb2] italic font-normal">safest</em> one.
            </h1>

            <p className="text-base sm:text-lg text-[#8bbeb2]/80 max-w-xl font-light leading-relaxed">
              Standard GPS navigates for speed. NightPath calculates Dijkstra paths weighted by live
              OpenStreetMap streetlights, verified 24/7 safe havens, and Google Street View drop-off inspections.
            </p>

            {/* Quick Search Teaser */}
            <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-[#8bbeb2] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Enter Mumbai destination (e.g. Bandra, Dadar, Powai)..."
                  className="w-full pl-10 pr-4 py-3 bg-[#18314f]/90 border border-[#8bbeb2]/25 rounded-xl text-xs font-bold text-white placeholder:text-[#8bbeb2]/40 focus:outline-none focus:border-[#8bbeb2]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Find Safe Route</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Metrics Chips */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-[#8bbeb2]/10 text-xs text-[#8bbeb2]/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e6f9af]" />
                <span>OSM Streetlight Tags</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e6f9af]" />
                <span>24/7 Verified Safe Havens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e6f9af]" />
                <span>Google Street View Previews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Route Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#18314f]/80 backdrop-blur-xl border border-[#8bbeb2]/25 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#8bbeb2]/15 pb-4">
                <div>
                  <span className="text-[10px] text-[#8bbeb2] uppercase tracking-wider font-bold">Live Comparison</span>
                  <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Bandra West ➔ BKC Junction</h3>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#e6f9af]/10 text-[#e6f9af] border border-[#e6f9af]/20 font-bold">
                  Midnight Run
                </span>
              </div>

              {/* Safest Option */}
              <div className="p-4 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e6f9af]/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e6f9af] text-[#0d0630]">
                    Recommended: Safest
                  </span>
                  <span className="font-serif text-xl font-black text-[#e6f9af]">94/100</span>
                </div>
                <div className="text-xs font-bold text-white mb-1">Via Ambedkar Road & Lit Arterials</div>
                <div className="text-[11px] text-[#8bbeb2]/70 flex items-center gap-3">
                  <span>⏱️ 14 mins</span>
                  <span>💡 98% Continuous Lighting</span>
                  <span>👮 3 Police Chowkis</span>
                </div>
              </div>

              {/* Fastest Option */}
              <div className="p-4 rounded-2xl bg-[#0d0630]/30 border border-[#8bbeb2]/10 opacity-75">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#384e77] text-[#8bbeb2]">
                    Shortest / Fastest
                  </span>
                  <span className="font-serif text-xl font-bold text-[#8bbeb2]">58/100</span>
                </div>
                <div className="text-xs font-bold text-slate-300 mb-1">Via Backlane Underpass Cut</div>
                <div className="text-[11px] text-[#8bbeb2]/60 flex items-center gap-3">
                  <span>⏱️ 11 mins (-3m)</span>
                  <span>⚠️ 2 Unlit Shadow Stretches</span>
                </div>
              </div>

              <button
                onClick={onLaunchPlanner}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8bbeb2] to-[#e6f9af] text-[#0d0630] font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Full Route Planner</span>
                <Navigation className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS SECTION ── */}
      <section className="py-20 px-6 lg:px-16 bg-[#18314f]/50 border-t border-b border-[#8bbeb2]/10 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">
              The NightPath Safety Architecture
            </span>
            <h2
              className="text-3xl sm:text-5xl font-bold text-[#e6f9af]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Engineered for the Vulnerable Hours
            </h2>
            <p className="text-sm text-[#8bbeb2]/75 font-light">
              We replace guesswork with 4 algorithmic layers designed specifically for nighttime navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0d0630]/70 border border-[#8bbeb2]/15 hover:border-[#8bbeb2]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8bbeb2]/10 border border-[#8bbeb2]/20 flex items-center justify-center text-[#e6f9af]">
                <Sun className="w-5 h-5 text-amber-300" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Streetlight Index</h3>
              <p className="text-xs text-[#8bbeb2]/70 leading-relaxed font-light">
                Evaluates real OpenStreetMap road tags (`lit=yes`, `highway=primary`) to eliminate unlit alleys.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#0d0630]/70 border border-[#8bbeb2]/15 hover:border-[#8bbeb2]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8bbeb2]/10 border border-[#8bbeb2]/20 flex items-center justify-center text-[#e6f9af]">
                <Eye className="w-5 h-5 text-cyan-300" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Street View Drop-off</h3>
              <p className="text-xs text-[#8bbeb2]/70 leading-relaxed font-light">
                Inspect high-resolution visual previews of your drop-off building entrance before you board.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0d0630]/70 border border-[#8bbeb2]/15 hover:border-[#8bbeb2]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8bbeb2]/10 border border-[#8bbeb2]/20 flex items-center justify-center text-[#e6f9af]">
                <Shield className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">24/7 Safe Havens</h3>
              <p className="text-xs text-[#8bbeb2]/70 leading-relaxed font-light">
                Live OpenStreetMap and Google Places integration highlights open pharmacies, police chowkis, and fuel stations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#0d0630]/70 border border-[#8bbeb2]/15 hover:border-[#8bbeb2]/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8bbeb2]/10 border border-[#8bbeb2]/20 flex items-center justify-center text-[#e6f9af]">
                <Navigation className="w-5 h-5 text-[#8bbeb2]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Dijkstra Corridors</h3>
              <p className="text-xs text-[#8bbeb2]/70 leading-relaxed font-light">
                Applies custom cost functions w(e) = length × (1 + α × risk) to synthesize high-safety multi-paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUTER PERSONAS SECTION ── */}
      <section className="py-20 px-6 lg:px-16 bg-[#0d0630]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#8bbeb2]/15 pb-6">
            <div>
              <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">Built for Every Night Commuter</span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#e6f9af] mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tailored Night Profiles
              </h2>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('onboarding')}
              className="text-xs text-[#8bbeb2] hover:text-[#e6f9af] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Customize Profile in Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#18314f]/60 border border-[#8bbeb2]/15 space-y-2">
              <span className="text-2xl">👩</span>
              <h4 className="font-bold text-[#e6f9af] text-sm">Solo Commuter</h4>
              <p className="text-xs text-[#8bbeb2]/70 font-light">
                Maximizes lighting coverage, CCTV avenues, and continuous footfall corridors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#18314f]/60 border border-[#8bbeb2]/15 space-y-2">
              <span className="text-2xl">💼</span>
              <h4 className="font-bold text-[#e6f9af] text-sm">Night Shift Worker</h4>
              <p className="text-xs text-[#8bbeb2]/70 font-light">
                Prioritizes arterial transit routes synchronized with police beat marshals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#18314f]/60 border border-[#8bbeb2]/15 space-y-2">
              <span className="text-2xl">🧳</span>
              <h4 className="font-bold text-[#e6f9af] text-sm">Tourist Mode</h4>
              <p className="text-xs text-[#8bbeb2]/70 font-light">
                Verified heritage & waterfront routes with multi-lingual emergency contacts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#18314f]/60 border border-[#8bbeb2]/15 space-y-2">
              <span className="text-2xl">🏢</span>
              <h4 className="font-bold text-[#e6f9af] text-sm">Corporate Fleets</h4>
              <p className="text-xs text-[#8bbeb2]/70 font-light">
                Automated night commute safety compliance and employee escort tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 lg:px-16 border-t border-[#8bbeb2]/15 bg-[#090420] text-xs text-[#8bbeb2]/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-black italic text-[#e6f9af]">NightPath</span>
            <span>• Smarter Routes After Dark</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('planner')} className="hover:text-[#e6f9af]">
              Route Planner
            </button>
            <button onClick={() => onNavigate('howItWorks')} className="hover:text-[#e6f9af]">
              How It Works
            </button>
            <button onClick={() => onNavigate('tourist')} className="hover:text-[#e6f9af]">
              Tourist Mode
            </button>
            <button onClick={() => onNavigate('corporate')} className="hover:text-[#e6f9af]">
              Corporate
            </button>
            <button onClick={() => onNavigate('report')} className="hover:text-[#e6f9af]">
              Report Hazard
            </button>
          </div>
          <p>© 2026 NightPath Safety System. Powered by OpenStreetMap & OSMnx.</p>
        </div>
      </footer>
    </div>
  );
}
