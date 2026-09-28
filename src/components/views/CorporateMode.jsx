import React, { useState } from 'react';
import {
  Briefcase,
  Shield,
  Users,
  CheckCircle2,
  Building,
  BarChart3,
  PhoneCall,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function CorporateMode({ onLaunchPlanner }) {
  const [companyName, setCompanyName] = useState('');
  const [employeeCount, setEmployeeCount] = useState('50-250');
  const [primaryHub, setPrimaryHub] = useState('bkc');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20 pb-20 bg-[#0d0630]">
      {/* ── HERO & DASHBOARD PREVIEW ── */}
      <section className="bg-[#18314f] border-b border-[#8bbeb2]/15 px-6 lg:px-16 py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0630]/60 border border-[#8bbeb2]/25 text-xs font-semibold text-[#8bbeb2] uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-[#e6f9af]" />
              Enterprise Employee Safety Platform
            </div>

            <h1
              className="text-3xl sm:text-5xl font-bold text-[#e6f9af] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Protecting Your Late-Shift Workforce, <em className="text-[#8bbeb2] italic font-normal">Systematically</em>.
            </h1>

            <p className="text-sm sm:text-base text-[#8bbeb2]/80 font-light leading-relaxed max-w-xl">
              Compliance-ready night routing for BPOs, IT enterprises, and hospital networks in Mumbai.
              Enforce lighted arterial routes for corporate cab fleets, prevent unverified shortcuts, and audit drop-offs in real time.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/60 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ POSH & Labor Law Night Compliance
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/60 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ Verified Cab Route Audits
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/60 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ 24/7 Security Operations Integration
              </span>
            </div>
          </div>

          {/* Interactive B2B Dashboard Preview */}
          <div className="lg:col-span-5 bg-[#0d0630]/80 backdrop-blur-xl border border-[#8bbeb2]/25 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#8bbeb2]/15 pb-3">
              <span className="text-[10px] text-[#8bbeb2] uppercase tracking-wider font-bold">Fleet Safety Monitor</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LIVE: 14 Cabs En Route
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#18314f]/50 border border-[#8bbeb2]/10 text-center">
                <div className="font-serif text-xl font-black text-[#e6f9af]">98.2%</div>
                <div className="text-[9px] text-[#8bbeb2]/60 uppercase">Safety Compliance</div>
              </div>
              <div className="p-3 rounded-xl bg-[#18314f]/50 border border-[#8bbeb2]/10 text-center">
                <div className="font-serif text-xl font-black text-[#8bbeb2]">0</div>
                <div className="text-[9px] text-[#8bbeb2]/60 uppercase">Active SOS Alerts</div>
              </div>
              <div className="p-3 rounded-xl bg-[#18314f]/50 border border-[#8bbeb2]/10 text-center">
                <div className="font-serif text-xl font-black text-[#e6f9af]">42 mins</div>
                <div className="text-[9px] text-[#8bbeb2]/60 uppercase">Avg Commute</div>
              </div>
            </div>

            {/* Cab Status Feed */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#18314f]/40 border border-[#8bbeb2]/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#e6f9af] block">Cab #MH02-4912 (BKC ➔ Malad)</span>
                  <span className="text-[10px] text-[#8bbeb2]/70">WEH Lit Corridor • 4 Female Associates</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold">Normal</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#18314f]/40 border border-[#8bbeb2]/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#e6f9af] block">Cab #MH01-8840 (Lower Parel ➔ Thane)</span>
                  <span className="text-[10px] text-[#8bbeb2]/70">Eastern Express Arterial • On Route</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE ONBOARDING FORM ── */}
      <section className="max-w-4xl mx-auto px-6 lg:px-16 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">Enterprise Pilot</span>
          <h2
            className="text-3xl font-bold text-[#e6f9af]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Deploy NightPath for Your Mumbai Team
          </h2>
          <p className="text-xs text-[#8bbeb2]/70 max-w-md mx-auto">
            Schedule a compliance integration demo with our enterprise team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#18314f]/70 border border-[#8bbeb2]/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]/70 block mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Tech Mumbai Pvt Ltd"
                className="w-full p-2.5 rounded-xl bg-[#0d0630] border border-[#8bbeb2]/20 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]/70 block mb-1">Employees Traveling Night Shifts</label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0d0630] border border-[#8bbeb2]/20 text-xs font-bold text-[#e6f9af] focus:outline-none"
              >
                <option value="10-50">10 – 50 Employees</option>
                <option value="50-250">50 – 250 Employees</option>
                <option value="250-1000">250 – 1,000 Employees</option>
                <option value="1000+">1,000+ Employees</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8bbeb2]/70 block mb-1">Primary Operating Office Hub</label>
            <select
              value={primaryHub}
              onChange={(e) => setPrimaryHub(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0d0630] border border-[#8bbeb2]/20 text-xs font-bold text-[#e6f9af] focus:outline-none"
            >
              <option value="bkc">Bandra-Kurla Complex (BKC)</option>
              <option value="mindspace">Mindspace Malad / Goregaon IT Zone</option>
              <option value="powai">Powai / Hiranandani Tech Parks</option>
              <option value="lower_parel">Lower Parel / Senapati Bapat Marg</option>
              <option value="navi_mumbai">Airoli / Mahape Millenium City</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSubmitted ? '✓ Pilot Request Dispatched!' : 'Request Enterprise Safety Assessment'}</span>
            {!isSubmitted && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </section>
    </div>
  );
}
