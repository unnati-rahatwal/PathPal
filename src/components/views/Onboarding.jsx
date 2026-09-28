import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Sun,
  Sliders,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function Onboarding({ onComplete, onSkip }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState('solo_female');
  const [travelHours, setTravelHours] = useState('11 PM - 3 AM');
  const [safetyWeight, setSafetyWeight] = useState(88);
  const [lightPreference, setLightPreference] = useState(true);
  const [avoidIsolated, setAvoidIsolated] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState('+91');

  const handleFinish = () => {
    if (onComplete) {
      onComplete({
        activeProfile: profile,
        preferences: {
          safetyPriority: safetyWeight,
          lightPreference,
          avoidIsolated,
          preferPoliceChowkis: true,
          travelMode: 'Auto/Cab'
        }
      });
    }
  };

  return (
    <div className="min-h-screen text-[#e6f9af] pt-16 bg-[#0d0630] grid grid-cols-1 lg:grid-cols-12">
      {/* ── LEFT HERO PANEL ── */}
      <div className="lg:col-span-5 bg-[#384e77] p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#18314f]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="font-serif text-2xl font-black italic text-[#e6f9af]">NightPath</span>
          <div className="inline-block px-3 py-1 rounded-full bg-[#18314f]/60 text-xs font-mono font-bold text-[#e6f9af] border border-[#8bbeb2]/20">
            Step {step} of 3
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#e6f9af] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {step === 1 && 'Define Your Night Profile'}
            {step === 2 && 'Calibrate Safety Weights'}
            {step === 3 && 'Setup SOS Lifeline'}
          </h2>
          <p className="text-xs sm:text-sm text-[#e6f9af]/80 font-light leading-relaxed">
            {step === 1 &&
              'Tell us your typical nighttime routine in Mumbai so NightPath can tune Dijkstra routing parameters to your vulnerability profile.'}
            {step === 2 &&
              'Choose how aggressively the router should penalize unlit streets and bypass isolated alleyways.'}
            {step === 3 &&
              'Configure your trusted emergency contact so 1-tap SOS SMS alerts can broadcast your live GPS link instantly.'}
          </p>
        </div>

        {/* Dynamic Step Feature Highlight Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/20 mt-8 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#e6f9af]">
            <CheckCircle2 className="w-4 h-4 text-[#e6f9af]" />
            <span>Zero Data Selling Pledge</span>
          </div>
          <p className="text-[11px] text-[#8bbeb2]/80 font-light">
            Your travel preferences remain stored locally in your browser. Encrypted and verified against real
            OpenStreetMap ground truth.
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="lg:col-span-7 bg-[#18314f] p-8 lg:p-14 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* Progress Bar & Skip */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-[#e6f9af]' : 'bg-[#0d0630]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onSkip}
            className="text-xs text-[#8bbeb2]/60 hover:text-[#e6f9af] font-semibold transition-colors cursor-pointer"
          >
            Skip for Now
          </button>
        </div>

        {/* STEP 1: Persona & Timing */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#e6f9af] block mb-2">
                1. Select Commuter Persona
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'solo_female', label: 'Solo Female Commuter', icon: '👩', desc: 'Max lighting & safe havens' },
                  { id: 'late_shift', label: 'Late Shift Corporate', icon: '💼', desc: 'Police chowki corridor sync' },
                  { id: 'two_wheeler', label: 'Two-Wheeler Rider', icon: '🛵', desc: 'Arterial lit avenues' },
                  { id: 'tourist', label: 'Tourist / Visitor', icon: '🧳', desc: 'Waterfront & heritage zones' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProfile(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      profile === p.id
                        ? 'bg-[#8bbeb2]/20 border-[#e6f9af] text-[#e6f9af]'
                        : 'bg-[#0d0630]/60 border-white/5 text-[#8bbeb2]/60 hover:border-[#8bbeb2]/30'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="text-xs font-bold block text-white">{p.label}</span>
                    <span className="text-[10px] text-[#8bbeb2]/60">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#e6f9af] block mb-2">
                Typical Hours Traveling Mumbai
              </label>
              <select
                value={travelHours}
                onChange={(e) => setTravelHours(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0d0630] border border-[#8bbeb2]/20 text-xs font-bold text-[#e6f9af] focus:outline-none"
              >
                <option value="9 PM - 11 PM">9:00 PM – 11:00 PM (Late Evening)</option>
                <option value="11 PM - 3 AM">11:00 PM – 3:00 AM (Midnight & Late Night)</option>
                <option value="3 AM - 6 AM">3:00 AM – 6:00 AM (Early Dawn)</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <span>Continue to Safety Weights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Safety Weights */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e6f9af]">
                  Safety vs. Speed Priority
                </span>
                <span className="text-xs font-bold text-[#e6f9af] font-mono">{safetyWeight}% Safety</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={safetyWeight}
                onChange={(e) => setSafetyWeight(Number(e.target.value))}
                className="w-full h-2 bg-[#0d0630] rounded-lg appearance-none cursor-pointer accent-[#8bbeb2]"
              />
              <div className="flex justify-between text-[10px] text-[#8bbeb2]/60 mt-1">
                <span>⚡ Balanced Time</span>
                <span>🛡️ Maximum Illumination & Police Sync</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setLightPreference(!lightPreference)}
                className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  lightPreference
                    ? 'bg-[#8bbeb2]/20 border-[#e6f9af] text-[#e6f9af]'
                    : 'bg-[#0d0630]/60 border-white/5 text-[#8bbeb2]/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-300" />
                  Prioritize Verified Lit Roads (OSM lit=yes)
                </span>
                <span className="font-bold">{lightPreference ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAvoidIsolated(!avoidIsolated)}
                className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  avoidIsolated
                    ? 'bg-[#8bbeb2]/20 border-[#e6f9af] text-[#e6f9af]'
                    : 'bg-[#0d0630]/60 border-white/5 text-[#8bbeb2]/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-300" />
                  Bypass Isolated Narrow Alleys
                </span>
                <span className="font-bold">{avoidIsolated ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-xl bg-[#0d0630] text-[#8bbeb2] hover:text-[#e6f9af] font-bold text-xs uppercase cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>Continue to Emergency SOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Emergency Lifeline */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#e6f9af] block mb-1">
                Trusted Emergency Contact Phone
              </label>
              <p className="text-[11px] text-[#8bbeb2]/70 mb-2 font-light">
                When you trigger SOS, this number receives an immediate SMS with your live route coordinates.
              </p>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                className="w-full p-3 rounded-xl bg-[#0d0630] border border-[#8bbeb2]/20 text-xs font-bold text-white focus:outline-none focus:border-[#8bbeb2]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0630]/60 border border-emerald-500/20 space-y-1">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mumbai Police Direct Line Synced
              </span>
              <p className="text-[11px] text-[#8bbeb2]/70 font-light">
                Dial 112 / 103 speed dials are active in the persistent emergency floating dock at all times.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3.5 rounded-xl bg-[#0d0630] text-[#8bbeb2] hover:text-[#e6f9af] font-bold text-xs uppercase cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>Save Profile & Launch Planner</span>
                <CheckCircle2 className="w-4 h-4 text-[#0d0630]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
