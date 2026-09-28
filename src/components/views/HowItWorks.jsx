import React from 'react';
import {
  Cpu,
  Layers,
  Sun,
  Shield,
  Eye,
  CheckCircle2,
  XCircle,
  Database,
  ArrowRight,
  Code2
} from 'lucide-react';

export default function HowItWorks({ onLaunchPlanner }) {
  const steps = [
    {
      num: '01',
      icon: '🌐',
      title: 'OSM Ingestion',
      desc: 'Downloads & caches 95k+ nodes and 224k+ road edges across Mumbai via OSMnx.'
    },
    {
      num: '02',
      icon: '💡',
      title: 'Tag Extraction',
      desc: 'Parses lighting tags (`lit=yes/no`), road classifications, and sidewalk coverage.'
    },
    {
      num: '03',
      icon: '⚖️',
      title: 'Edge Scoring',
      desc: 'Calculates a 0–100 safety score per edge based on illumination, isolation, and POIs.'
    },
    {
      num: '04',
      icon: '📐',
      title: 'Dijkstra Multi-Path',
      desc: 'Runs weighted shortest-path algorithms to generate Safest, Balanced, and Fastest routes.'
    },
    {
      num: '05',
      icon: '📸',
      title: 'Visual Inspection',
      desc: 'Pairs route endpoints with Google Street View static preview images for drop-off safety.'
    }
  ];

  const tags = [
    { tag: 'lit=yes', score: '+35 pts', effect: 'Verified continuous street illumination' },
    { tag: 'highway=primary', score: '+18 pts', effect: 'Wide arterial road with active vehicular footfall' },
    { tag: 'sidewalk=both', score: '+8 pts', effect: 'Dedicated pedestrian infrastructure' },
    { tag: 'access=private', score: '-15 pts', effect: 'Restricted corridor with limited escape routes' },
    { tag: 'lit=no', score: '-20 pts', effect: 'Unlit dark spot with zero streetlight coverage' }
  ];

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20 pb-20 bg-[#0d0630]">
      {/* ── HERO ── */}
      <section className="bg-[#18314f] border-b border-[#8bbeb2]/15 px-6 lg:px-16 py-14 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">
            The Algorithmic Foundation
          </span>
          <h1
            className="text-4xl sm:text-6xl font-bold text-[#e6f9af]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How NightPath Works
          </h1>
          <p className="text-sm sm:text-base text-[#8bbeb2]/80 max-w-xl mx-auto font-light leading-relaxed">
            Standard routing engines minimize distance and traffic. NightPath computes graph weights where
            unlit and isolated streets incur heavy algorithmic penalties.
          </p>

          {/* Formula Display Box */}
          <div className="pt-4">
            <div className="inline-block p-4 sm:p-5 rounded-2xl bg-[#0d0630]/80 border border-[#8bbeb2]/30 text-xs sm:text-sm font-mono text-[#e6f9af] shadow-xl">
              <span className="text-[#8bbeb2]">w(e)</span> = length(e) × [1 + α × (1 −{' '}
              <span className="text-emerald-300">safety_score</span> / 100) × 9]
            </div>
            <p className="text-[11px] text-[#8bbeb2]/60 mt-2">
              Where α controls the safety priority: Safest (0.90), Balanced (0.50), Fastest (0.05).
            </p>
          </div>
        </div>
      </section>

      {/* ── 5-STEP PIPELINE ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">End-to-End Execution</span>
          <h2
            className="text-3xl font-bold text-[#e6f9af]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The 5-Step Safety Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/15 hover:border-[#8bbeb2]/40 transition-all text-center space-y-2.5 relative group"
            >
              <div className="text-[10px] font-mono font-bold text-[#8bbeb2]">{st.num}</div>
              <div className="text-2xl">{st.icon}</div>
              <h3 className="font-serif text-sm font-bold text-[#e6f9af]">{st.title}</h3>
              <p className="text-[11px] text-[#8bbeb2]/70 font-light leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OSM TAG WEIGHT MATRIX ── */}
      <section className="bg-[#18314f]/50 border-t border-b border-[#8bbeb2]/10 py-16 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">Ground Truth Data</span>
            <h2
              className="text-3xl font-bold text-[#e6f9af]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              OpenStreetMap Feature Scoring
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#8bbeb2]/20 bg-[#0d0630]/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18314f] text-[#8bbeb2] border-b border-[#8bbeb2]/15">
                <tr>
                  <th className="p-3.5 font-bold">OSM Tag</th>
                  <th className="p-3.5 font-bold">Safety Weight</th>
                  <th className="p-3.5 font-bold">Real-World Environmental Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8bbeb2]/10">
                {tags.map((t, i) => (
                  <tr key={i} className="hover:bg-[#18314f]/40 transition-colors">
                    <td className="p-3.5 font-mono text-[#e6f9af] font-bold">{t.tag}</td>
                    <td
                      className={`p-3.5 font-mono font-bold ${
                        t.score.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {t.score}
                    </td>
                    <td className="p-3.5 text-[#8bbeb2]/80">{t.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── COMPARISON MATRIX ── */}
      <section className="max-w-5xl mx-auto px-6 lg:px-16 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">Why Standard GPS Fails At Night</span>
          <h2
            className="text-3xl font-bold text-[#e6f9af]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Traditional Maps vs. NightPath
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#18314f]/40 border border-red-500/20 space-y-3">
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
              <XCircle className="w-5 h-5" />
              <span>Traditional Navigation Apps</span>
            </div>
            <ul className="space-y-2 text-xs text-[#8bbeb2]/70 font-light">
              <li>• Routes pedestrians through unlit backlanes to save 45 seconds</li>
              <li>• Oblivious to streetlamp presence or broken fixtures</li>
              <li>• No awareness of verified 24/7 safe havens or police chowkis</li>
              <li>• Blind to isolated dead-ends and dark zones</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-[#18314f]/60 border border-[#e6f9af]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#e6f9af] text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#e6f9af]" />
              <span>NightPath Dynamic Architecture</span>
            </div>
            <ul className="space-y-2 text-xs text-[#8bbeb2] font-light">
              <li>• Penalizes unlit roads by up to 10× in graph cost</li>
              <li>• Queries live Overpass OpenStreetMap POIs in real time</li>
              <li>• Provides Google Street View visual drop-off inspections</li>
              <li>• Integrates live community crowdsourced safety reports</li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-6">
          <button
            onClick={onLaunchPlanner}
            className="px-6 py-3 rounded-full bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            Try It Now in Route Planner
          </button>
        </div>
      </section>
    </div>
  );
}
