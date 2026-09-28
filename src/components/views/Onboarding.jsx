import React, { useState } from 'react';

export default function Onboarding({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Permissions state
  const [permissions, setPermissions] = useState({
    location: true,
    notifications: true,
    contacts: false,
    microphone: false
  });

  // Step 2: Travel Persona & Weights state
  const [activePreset, setActivePreset] = useState('nightOwl');
  const [weights, setWeights] = useState({
    light: 9,
    crowd: 7,
    shops: 6,
    speed: 4
  });

  // Step 3: Emergency contact state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [ghostSentry, setGhostSentry] = useState(true);
  const [shareLiveOnSOS, setShareLiveOnSOS] = useState(true);

  const applyPreset = (presetName, l, c, s, sp) => {
    setActivePreset(presetName);
    setWeights({ light: l, crowd: c, shops: s, speed: sp });
  };

  const getStepHeroInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          label: 'Step 1 of 3',
          title: 'Let’s make your routes yours.',
          desc: 'Two minutes of setup means every route NightPath suggests is tuned to how you actually travel after dark.'
        };
      case 2:
        return {
          label: 'Step 2 of 3',
          title: 'Your safety, your balance.',
          desc: 'Choose how heavily lighting, pedestrian footfall, and travel speed shape your suggested corridors.'
        };
      case 3:
        return {
          label: 'Step 3 of 3',
          title: 'A safety net, just in case.',
          desc: 'Your emergency contacts are contacted strictly if you trigger SOS or miss a Ghost Sentry checkpoint.'
        };
      default:
        return {
          label: 'Setup Complete',
          title: 'You are all set for Mumbai.',
          desc: 'Every journey after dark is backed by live street lighting models and verified 24/7 safe havens.'
        };
    }
  };

  const heroInfo = getStepHeroInfo();

  return (
    <div className="onboarding-root text-[#e6f9af] min-h-screen bg-[#0d0630] grid grid-cols-1 lg:grid-cols-2">
      <style>{`
        .onboarding-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
        }

        /* LEFT HERO */
        .ob-hero {
          background: var(--slate);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 4rem;
        }
        .ob-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(139,190,178,0.07) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .ob-glow-a {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 480px;
          height: 480px;
          background: radial-gradient(ellipse, rgba(56,78,119,0.7) 0%, transparent 60%);
          pointer-events: none;
        }
        .ob-glow-b {
          position: absolute;
          bottom: -15%;
          left: -5%;
          width: 400px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(139,190,178,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        .ob-hp-step-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 1rem;
        }
        .ob-hp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          color: var(--lime);
          margin-bottom: 1.1rem;
        }
        .ob-hp-desc {
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(230,249,175,0.65);
          line-height: 1.75;
          max-width: 400px;
          margin-bottom: 2.2rem;
        }
        .hpv-card {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.14);
          border-radius: 14px;
          padding: 0.8rem 1.1rem;
          backdrop-filter: blur(4px);
          margin-bottom: 0.7rem;
        }

        /* RIGHT FORM */
        .ob-form-panel {
          background: var(--navy);
          display: flex;
          flex-direction: column;
          padding: 3rem 4rem;
          overflow-y: auto;
        }
        .ob-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        .ob-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          max-width: 280px;
        }
        .ob-pg-seg {
          flex: 1;
          height: 4px;
          background: rgba(56,78,119,0.5);
          border-radius: 100px;
          overflow: hidden;
          position: relative;
        }
        .ob-pg-seg.done {
          background: linear-gradient(90deg, var(--teal), var(--lime));
        }

        .ob-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.5rem;
        }
        .ob-step-title em {
          font-style: italic;
          color: var(--teal);
        }
        .ob-step-sub {
          font-size: 0.88rem;
          font-weight: 300;
          color: rgba(139,190,178,0.55);
          line-height: 1.65;
          margin-bottom: 2rem;
        }

        /* PERMISSIONS */
        .perm-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        .perm {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.14);
          border-radius: 16px;
          padding: 1.1rem 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .perm.on {
          background: rgba(139,190,178,0.08);
          border-color: var(--teal);
        }
        .perm-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(139,190,178,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: transparent;
        }
        .perm.on .perm-check {
          background: var(--teal);
          border-color: var(--teal);
          color: var(--deep);
        }

        /* PRESETS */
        .ob-presets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-bottom: 1.6rem;
        }
        .ob-preset {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.14);
          border-radius: 14px;
          padding: 0.9rem 0.6rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ob-preset.on {
          background: rgba(139,190,178,0.1);
          border-color: var(--teal);
        }

        /* WEIGHTS */
        .ob-weights {
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 16px;
          padding: 1.2rem 1.3rem;
          margin-bottom: 1.5rem;
        }
        .ob-w-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }
        .ob-w-row:last-child {
          margin-bottom: 0;
        }

        .ob-btn-next {
          flex: 1;
          background: var(--lime);
          color: var(--deep);
          padding: 0.95rem;
          border: none;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-align: center;
        }
        .ob-btn-next:hover {
          background: var(--teal);
          transform: translateY(-1px);
        }
        .ob-btn-back {
          background: transparent;
          color: var(--teal);
          padding: 0.95rem 1.6rem;
          border: 1px solid rgba(139,190,178,0.25);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        @media(max-width: 1024px) {
          .ob-hero { display: none; }
          .ob-form-panel { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="ob-hero">
        <div className="ob-glow-a" />
        <div className="ob-glow-b" />
        <div>
          <span className="font-serif text-2xl font-black italic text-[#e6f9af]">
            Night<span className="text-[#8bbeb2]">Path</span>
          </span>
        </div>

        <div className="my-auto py-8">
          <div className="ob-hp-step-label">{heroInfo.label}</div>
          <h2 className="ob-hp-title">{heroInfo.title}</h2>
          <p className="ob-hp-desc">{heroInfo.desc}</p>

          <div className="space-y-2 max-w-sm">
            <div className="hpv-card">
              <span className="text-xl">📍</span>
              <div className="text-xs">
                <strong className="block text-[#e6f9af]">Location, only when needed</strong>
                <span className="text-[#8bbeb2]/70">Sampled at street decision nodes — near-zero battery drain</span>
              </div>
            </div>
            <div className="hpv-card">
              <span className="text-xl">🔔</span>
              <div className="text-xs">
                <strong className="block text-[#e6f9af]">Hazard alerts</strong>
                <span className="text-[#8bbeb2]/70">Know about waterlogging and unlit stretches beforehand</span>
              </div>
            </div>
            <div className="hpv-card">
              <span className="text-xl">🔒</span>
              <div className="text-xs">
                <strong className="block text-[#e6f9af]">Private by design</strong>
                <span className="text-[#8bbeb2]/70">Trip histories are strictly stored locally on your device</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#8bbeb2]/40">© 2025 NightPath · Mumbai Safe Night Transport</div>
      </div>

      {/* RIGHT WIZARD */}
      <div className="ob-form-panel">
        <div className="ob-top-row">
          <div className="ob-progress">
            <div className={`ob-pg-seg ${currentStep >= 1 ? 'done' : ''}`} />
            <div className={`ob-pg-seg ${currentStep >= 2 ? 'done' : ''}`} />
            <div className={`ob-pg-seg ${currentStep >= 3 ? 'done' : ''}`} />
            <span className="text-xs text-[#8bbeb2]/50 ml-2 font-mono">
              {currentStep > 3 ? 'Done' : `${currentStep} / 3`}
            </span>
          </div>

          <button
            onClick={() => onSkip ? onSkip() : onComplete && onComplete()}
            className="text-xs text-[#8bbeb2]/60 hover:text-[#e6f9af] cursor-pointer"
          >
            Skip for now →
          </button>
        </div>

        <div className="max-w-md w-full my-auto">
          {/* STEP 1: PERMISSIONS */}
          {currentStep === 1 && (
            <div>
              <h2 className="ob-step-title">
                Allow what <em>you&apos;re comfortable</em> with
              </h2>
              <p className="ob-step-sub">
                NightPath works best with these permissions, but you stay in control. Change any of them later.
              </p>

              <div className="perm-list">
                <div
                  className={`perm ${permissions.location ? 'on' : ''}`}
                  onClick={() => setPermissions({ ...permissions, location: !permissions.location })}
                >
                  <span className="text-2xl">📍</span>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-[#e6f9af] flex items-center gap-1.5">
                      Location
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[#e6f9af]/10 text-[#e6f9af]">
                        Required
                      </span>
                    </div>
                    <div className="text-[#8bbeb2]/60 mt-0.5">
                      To route from where you are and show nearby police chowkis.
                    </div>
                  </div>
                  <div className="perm-check">✓</div>
                </div>

                <div
                  className={`perm ${permissions.notifications ? 'on' : ''}`}
                  onClick={() => setPermissions({ ...permissions, notifications: !permissions.notifications })}
                >
                  <span className="text-2xl">🔔</span>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-[#e6f9af] flex items-center gap-1.5">
                      Notifications
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[#8bbeb2]/10 text-[#8bbeb2]">
                        Recommended
                      </span>
                    </div>
                    <div className="text-[#8bbeb2]/60 mt-0.5">
                      Hazard alerts, dark lane warnings, and Ghost Sentry check-ins.
                    </div>
                  </div>
                  <div className="perm-check">✓</div>
                </div>

                <div
                  className={`perm ${permissions.contacts ? 'on' : ''}`}
                  onClick={() => setPermissions({ ...permissions, contacts: !permissions.contacts })}
                >
                  <span className="text-2xl">👥</span>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-[#e6f9af]">Contacts (Optional)</div>
                    <div className="text-[#8bbeb2]/60 mt-0.5">
                      Pick trusted emergency contacts without manual entry.
                    </div>
                  </div>
                  <div className="perm-check">✓</div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setCurrentStep(2)} className="ob-btn-next">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PREFERENCES */}
          {currentStep === 2 && (
            <div>
              <h2 className="ob-step-title">
                How do you <em>travel?</em>
              </h2>
              <p className="ob-step-sub">
                Pick a starting persona, then fine-tune. NightPath learns from the corridors you choose.
              </p>

              <div className="ob-presets">
                <div
                  className={`ob-preset ${activePreset === 'nightOwl' ? 'on' : ''}`}
                  onClick={() => applyPreset('nightOwl', 9, 7, 6, 4)}
                >
                  <span className="text-2xl block mb-1">🌙</span>
                  <div className="text-xs font-bold text-[#e6f9af]">Night Owl</div>
                  <div className="text-[10px] text-[#8bbeb2]/50">Lit &amp; busy</div>
                </div>

                <div
                  className={`ob-preset ${activePreset === 'speed' ? 'on' : ''}`}
                  onClick={() => applyPreset('speed', 5, 4, 4, 9)}
                >
                  <span className="text-2xl block mb-1">⚡</span>
                  <div className="text-xs font-bold text-[#e6f9af]">In a Hurry</div>
                  <div className="text-[10px] text-[#8bbeb2]/50">Speed first</div>
                </div>

                <div
                  className={`ob-preset ${activePreset === 'careful' ? 'on' : ''}`}
                  onClick={() => applyPreset('careful', 10, 9, 9, 2)}
                >
                  <span className="text-2xl block mb-1">🛡️</span>
                  <div className="text-xs font-bold text-[#e6f9af]">Extra Careful</div>
                  <div className="text-[10px] text-[#8bbeb2]/50">Safety first</div>
                </div>
              </div>

              <div className="ob-weights space-y-3">
                <div className="ob-w-row">
                  <span className="w-6">💡</span>
                  <span className="text-xs w-20">Lighting</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={weights.light}
                    onChange={(e) => setWeights({ ...weights, light: +e.target.value })}
                    className="flex-1 accent-[#8bbeb2]"
                  />
                  <span className="text-xs font-bold text-[#8bbeb2] w-5 text-right">{weights.light}</span>
                </div>

                <div className="ob-w-row">
                  <span className="w-6">👥</span>
                  <span className="text-xs w-20">Footfall</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={weights.crowd}
                    onChange={(e) => setWeights({ ...weights, crowd: +e.target.value })}
                    className="flex-1 accent-[#8bbeb2]"
                  />
                  <span className="text-xs font-bold text-[#8bbeb2] w-5 text-right">{weights.crowd}</span>
                </div>

                <div className="ob-w-row">
                  <span className="w-6">🏪</span>
                  <span className="text-xs w-20">Open Shops</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={weights.shops}
                    onChange={(e) => setWeights({ ...weights, shops: +e.target.value })}
                    className="flex-1 accent-[#8bbeb2]"
                  />
                  <span className="text-xs font-bold text-[#8bbeb2] w-5 text-right">{weights.shops}</span>
                </div>

                <div className="ob-w-row">
                  <span className="w-6">⚡</span>
                  <span className="text-xs w-20">Speed</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={weights.speed}
                    onChange={(e) => setWeights({ ...weights, speed: +e.target.value })}
                    className="flex-1 accent-[#8bbeb2]"
                  />
                  <span className="text-xs font-bold text-[#8bbeb2] w-5 text-right">{weights.speed}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setCurrentStep(1)} className="ob-btn-back">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(3)} className="ob-btn-next">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EMERGENCY CONTACT */}
          {currentStep === 3 && (
            <div>
              <h2 className="ob-step-title">
                Who should we <em>alert</em> first?
              </h2>
              <p className="ob-step-sub">
                Add at least one trusted person. They are only contacted if you trigger SOS or miss a Ghost Sentry check-in.
              </p>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8bbeb2]/60 mb-1">
                    Contact Name
                  </label>
                  <input
                    className="w-full bg-[#0d0630]/60 border border-[#8bbeb2]/20 rounded-xl p-3 text-xs text-white outline-none"
                    placeholder="e.g. Priya Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8bbeb2]/60 mb-1">
                      Phone Number
                    </label>
                    <input
                      className="w-full bg-[#0d0630]/60 border border-[#8bbeb2]/20 rounded-xl p-3 text-xs text-white outline-none"
                      placeholder="+91 98200 12345"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8bbeb2]/60 mb-1">
                      Relationship
                    </label>
                    <select
                      className="w-full bg-[#0d0630]/60 border border-[#8bbeb2]/20 rounded-xl p-3 text-xs text-white outline-none"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                    >
                      <option>Family</option>
                      <option>Friend</option>
                      <option>Partner</option>
                      <option>Colleague</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0d0630]/40 border border-[#8bbeb2]/10 space-y-3 mb-6 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#e6f9af]">Ghost Sentry Enabled</span>
                    <span className="block text-[11px] text-[#8bbeb2]/50">Ping contact only if halted in unlit area</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={ghostSentry}
                    onChange={(e) => setGhostSentry(e.target.checked)}
                    className="accent-[#8bbeb2] w-4 h-4 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#e6f9af]">Share GPS when SOS fires</span>
                    <span className="block text-[11px] text-[#8bbeb2]/50">Emergency SMS dispatch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareLiveOnSOS}
                    onChange={(e) => setShareLiveOnSOS(e.target.checked)}
                    className="accent-[#8bbeb2] w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep(2)} className="ob-btn-back">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="ob-btn-next">
                  Finish Setup ✓
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETED SUMMARY */}
          {currentStep === 4 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#e6f9af]/10 border-2 border-[#8bbeb2] flex items-center justify-center text-4xl mx-auto">
                ✓
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#e6f9af]">
                Ready for Mumbai Nights
              </h2>
              <p className="text-xs text-[#8bbeb2]/70 max-w-sm mx-auto leading-relaxed">
                Your commuter profile is synchronized. OSM lighting algorithms and live safe haven anchors are active.
              </p>

              <div className="p-4 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/15 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#e6f9af]">
                  <span className="text-[#8bbeb2]">✓</span>
                  <span>OSM Streetlight Tags prioritized ({weights.light}/10)</span>
                </div>
                <div className="flex items-center gap-2 text-[#e6f9af]">
                  <span className="text-[#8bbeb2]">✓</span>
                  <span>24/7 Police Chowki &amp; Pharmacy radar active</span>
                </div>
                <div className="flex items-center gap-2 text-[#e6f9af]">
                  <span className="text-[#8bbeb2]">✓</span>
                  <span>Ghost Sentry armed for {contactName || 'Trusted Contact'}</span>
                </div>
              </div>

              <button
                onClick={() => onComplete ? onComplete() : onSkip && onSkip()}
                className="w-full py-4 rounded-full bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                Start Planning Safe Routes →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
