import React, { useState } from 'react';

export default function HowItWorks({ onLaunchPlanner, onNavigate }) {
  // Model weights interactive slider state
  const [weights, setWeights] = useState({
    light: 9,
    crowd: 7,
    shops: 6,
    speed: 4
  });

  // Time decay interactive simulator state
  const [decayParams, setDecayParams] = useState({
    lambda: 0.25,
    age: 6
  });

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  // Compute model output dynamically
  const sFast = (10 - weights.speed * 0.8).toFixed(1);
  const sMain = (weights.light * 0.5 + weights.crowd * 0.4).toFixed(1);
  const sSafe = (weights.light * 0.65 + weights.crowd * 0.25 + weights.shops * 0.1).toFixed(1);

  let winner = '✦ NightPath Route';
  if (weights.speed >= 8 && weights.light <= 4) winner = '⚡ Fastest Route';
  else if (weights.speed > 6 && weights.light < 7) winner = '🏙️ Main Road Route';

  // Compute decay calculations
  const weightNow = Math.round(Math.exp(-decayParams.lambda * decayParams.age) * 100);
  const halfLife = (Math.LN2 / decayParams.lambda).toFixed(1);
  let impact = 'Low';
  if (weightNow > 60) impact = 'High';
  else if (weightNow > 25) impact = 'Medium';

  // SVG decay curve calculations
  const dLinePoints = Array.from({ length: 25 }, (_, i) => {
    const x = (i / 24) * 400;
    const y = 170 - Math.exp(-decayParams.lambda * i) * 140;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const dLinePath = 'M ' + dLinePoints.join(' L ');
  const dAreaPath = `${dLinePath} L 400,170 L 0,170 Z`;
  const dotX = (decayParams.age / 24) * 400;
  const dotY = 170 - (weightNow / 100) * 140;

  const faqs = [
    {
      q: 'Why not just use Google Maps?',
      a: 'Google Maps optimizes almost purely for estimated travel time and traffic volume. It has no data layer for whether a lane has working streetlights, footfall density, or active shop fronts after 10 PM. A 4-minute shortcut through a pitch-black underpass looks identical to a main thoroughfare to standard GPS engines. NightPath solves specifically for after-dark reassurance.'
    },
    {
      q: 'How accurate is the street lighting data for Mumbai?',
      a: 'We combine OpenStreetMap `lit=yes/no` tags with VIIRS nighttime satellite radiometry from NASA Earthdata and crowdsourced lighting audit points. Where direct streetlight counts are unmapped (such as in outer suburbs), we openly mark route confidence as Medium or Low and fall back to arterial roads.'
    },
    {
      q: 'How does Ghost Sentry know if I am in trouble without draining my battery?',
      a: 'Ghost Sentry does not stream continuous high-frequency GPS to a remote server. Instead, it evaluates waypoints locally on your device only at decision nodes and street turns. If your device halts in an unlit corridor for longer than 4 minutes or veers off course, it prompts you and dispatches an alert to your chosen contact.'
    },
    {
      q: 'Do you share my trip history with corporations or the government?',
      a: 'Never on an individual level. Route logs are stored locally on your device. We only produce aggregated, k-anonymized heatmaps of avoided corridors for BMC civic reports (e.g. "312 commuters avoided Lane B in Kurla West after 10 PM"), ensuring personal commute habits are mathematically untraceable.'
    }
  ];

  return (
    <div className="how-it-works-root text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .how-it-works-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .hiw-hero {
          padding: 9rem 2.5rem 5rem;
          background: var(--navy);
          text-align: center;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(139,190,178,0.1);
        }
        .hiw-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 55px 55px;
          pointer-events: none;
        }
        .hiw-hero-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(56,78,119,0.55) 0%, transparent 65%);
          pointer-events: none;
        }
        .hiw-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 760px;
          margin: 0 auto;
        }
        .hiw-section-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.8rem;
        }
        .hiw-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.06;
          color: var(--lime);
          margin-bottom: 1.2rem;
        }
        .hiw-h1 em {
          font-style: italic;
          color: var(--teal);
        }
        .hiw-hero p {
          font-size: 1rem;
          font-weight: 300;
          color: rgba(139,190,178,0.62);
          line-height: 1.75;
          max-width: 560px;
          margin: 0 auto 2rem;
        }
        .hiw-hero-formula {
          display: inline-block;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 14px;
          padding: 0.9rem 1.6rem;
          font-family: 'DM Sans', monospace;
          font-size: 0.85rem;
          color: var(--lime);
          letter-spacing: 0.02em;
        }
        .hiw-hero-formula em {
          font-style: normal;
          color: var(--teal);
        }

        /* TOC */
        .hiw-toc {
          position: sticky;
          top: 58px;
          z-index: 40;
          background: rgba(13,6,48,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(139,190,178,0.1);
          padding: 0.8rem 2.5rem;
          overflow-x: auto;
        }
        .hiw-toc-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 0.5rem;
          white-space: nowrap;
        }
        .hiw-toc a {
          font-size: 0.76rem;
          font-weight: 500;
          color: rgba(139,190,178,0.6);
          text-decoration: none;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .hiw-toc a:hover {
          color: var(--lime);
          background: rgba(139,190,178,0.1);
          border-color: rgba(139,190,178,0.2);
        }

        .hiw-section {
          padding: 5.5rem 2.5rem;
        }
        .hiw-section.alt {
          background: var(--navy);
          border-top: 1px solid rgba(139,190,178,0.08);
          border-bottom: 1px solid rgba(139,190,178,0.08);
        }
        .hiw-section.slate {
          background: var(--slate);
          position: relative;
          overflow: hidden;
        }
        .hiw-section.slate::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(139,190,178,0.06) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }
        .hiw-wrap {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .hiw-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.4vw, 2.6rem);
          font-weight: 700;
          color: var(--lime);
          line-height: 1.15;
          margin-bottom: 0.9rem;
        }
        .hiw-h2 em {
          font-style: italic;
          color: var(--teal);
        }
        .hiw-section-desc {
          font-size: 0.94rem;
          font-weight: 300;
          color: rgba(139,190,178,0.55);
          line-height: 1.75;
          max-width: 600px;
          margin-bottom: 2.8rem;
        }

        /* PIPELINE */
        .pipeline {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.8rem;
          align-items: stretch;
        }
        .pl-node {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 18px;
          padding: 1.3rem 1rem;
          text-align: center;
          position: relative;
          transition: transform 0.25s, border-color 0.25s;
        }
        .pl-node:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.35);
        }
        .pl-node.hl {
          background: rgba(230,249,175,0.07);
          border-color: rgba(230,249,175,0.3);
        }
        .pl-num {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--teal);
          margin-bottom: 0.6rem;
        }
        .pl-icon {
          font-size: 1.7rem;
          display: block;
          margin-bottom: 0.6rem;
        }
        .pl-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.4rem;
        }
        .pl-desc {
          font-size: 0.7rem;
          color: rgba(139,190,178,0.55);
          line-height: 1.55;
          font-weight: 300;
        }

        /* EDGE FEATURES */
        .edge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
          margin-top: 3.5rem;
        }
        .edge-box {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 22px;
          padding: 1.6rem;
        }
        .eb-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
        }
        .eb-sub {
          font-size: 0.74rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.2rem;
        }
        .feat-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(139,190,178,0.07);
        }
        .feat-row:last-child {
          border-bottom: none;
        }
        .fr-ico {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(56,78,119,0.4);
          border: 1px solid rgba(139,190,178,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .fr-t {
          flex: 1;
          font-size: 0.82rem;
          color: var(--lime);
          font-weight: 500;
        }
        .fr-t em {
          display: block;
          font-style: normal;
          font-size: 0.68rem;
          color: rgba(139,190,178,0.45);
          font-weight: 300;
          margin-top: 0.1rem;
        }
        .fr-w {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--teal);
        }

        /* SCORING MODEL */
        .model-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .weight-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 22px;
          padding: 1.8rem;
        }
        .wc-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
        }
        .wc-sub {
          font-size: 0.75rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.3rem;
          line-height: 1.5;
        }
        .sl-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.95rem;
        }
        .sl-row label {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.75);
          width: 96px;
          flex-shrink: 0;
        }
        .sl-row input[type=range] {
          flex: 1;
          accent-color: var(--teal);
        }
        .sl-row .sv {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--teal);
          width: 22px;
          text-align: right;
        }
        .result-box {
          background: rgba(230,249,175,0.07);
          border: 1px solid rgba(230,249,175,0.2);
          border-radius: 16px;
          padding: 1.1rem;
          margin-top: 1.2rem;
        }
        .rb-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          padding: 0.4rem 0;
        }
        .rb-row span:first-child {
          color: rgba(139,190,178,0.6);
        }
        .rb-row b {
          font-family: 'Playfair Display', serif;
          color: var(--lime);
          font-size: 1rem;
        }
        .rb-big {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.7rem;
          margin-top: 0.4rem;
          border-top: 1px solid rgba(139,190,178,0.12);
        }
        .rb-big span {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.55);
        }
        .rb-big b {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--lime);
        }

        .algo-card {
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 20px;
          padding: 1.4rem;
          margin-bottom: 1.2rem;
        }
        .ac-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.7rem;
        }
        .hiw-code {
          font-family: 'DM Sans', monospace;
          font-size: 0.78rem;
          line-height: 1.9;
          color: rgba(230,249,175,0.85);
        }
        .hiw-code .c { color: rgba(139,190,178,0.45); }
        .hiw-code .k { color: var(--teal); }
        .algo-note {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.55);
          line-height: 1.7;
          margin-top: 0.8rem;
          font-weight: 300;
        }
        .algo-note strong {
          color: var(--lime);
          font-weight: 500;
        }

        /* DECAY */
        .decay-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        .decay-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 22px;
          padding: 1.6rem;
        }
        .dc-chart {
          height: 180px;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.7rem;
        }
        .dc-chart svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .dc-axis {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: rgba(139,190,178,0.4);
          margin-bottom: 1rem;
        }
        .dc-ctrl {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .dc-ctrl label {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.75);
          width: 90px;
        }
        .dc-ctrl input {
          flex: 1;
          accent-color: var(--teal);
        }
        .dc-ctrl b {
          font-size: 0.78rem;
          color: var(--teal);
          width: 70px;
          text-align: right;
        }
        .dc-stat {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-top: 1rem;
        }
        .dcs {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 12px;
          padding: 0.7rem;
          text-align: center;
        }
        .dcs-v {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--lime);
        }
        .dcs-l {
          font-size: 0.58rem;
          color: rgba(139,190,178,0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.15rem;
        }

        /* DATASETS */
        .ds-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.4rem;
        }
        .ds-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 20px;
          padding: 1.6rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .ds-card:hover {
          border-color: rgba(139,190,178,0.3);
          transform: translateY(-3px);
        }
        .ds-head {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.9rem;
        }
        .ds-ico {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(56,78,119,0.4);
          border: 1px solid rgba(139,190,178,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .ds-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--lime);
          flex: 1;
        }
        .cov {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
        }
        .cov-hi {
          background: rgba(230,249,175,0.1);
          color: var(--lime);
          border: 1px solid rgba(230,249,175,0.22);
        }
        .cov-mid {
          background: rgba(139,190,178,0.1);
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.22);
        }
        .cov-lo {
          background: rgba(56,78,119,0.4);
          color: rgba(139,190,178,0.6);
          border: 1px solid rgba(139,190,178,0.14);
        }
        .ds-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 0.9rem;
        }
        .ds-item {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.75);
          line-height: 1.5;
          display: flex;
          gap: 0.6rem;
        }
        .ds-item::before {
          content: '→';
          color: var(--teal);
          flex-shrink: 0;
        }
        .ds-item em {
          font-style: normal;
          color: rgba(139,190,178,0.5);
          font-size: 0.72rem;
          display: block;
        }
        .ds-note {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.5);
          line-height: 1.6;
          background: rgba(13,6,48,0.4);
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
          font-weight: 300;
        }

        /* FAQ */
        .faq-list {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .faq {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.11);
          border-radius: 16px;
          overflow: hidden;
        }
        .faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.15rem 1.4rem;
          cursor: pointer;
          font-size: 0.94rem;
          font-weight: 500;
          color: var(--lime);
          transition: background 0.2s;
        }
        .faq-q:hover {
          background: rgba(139,190,178,0.04);
        }
        .faq-i {
          color: var(--teal);
          font-size: 1.2rem;
          transition: transform 0.3s;
          flex-shrink: 0;
        }
        .faq.open .faq-i {
          transform: rotate(45deg);
        }
        .faq-a {
          padding: 0 1.4rem 1.2rem;
        }
        .faq-a p {
          font-size: 0.86rem;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(139,190,178,0.65);
        }

        @media(max-width: 1000px) {
          .pipeline { grid-template-columns: repeat(2, 1fr); }
          .edge-grid, .model-layout, .decay-layout, .ds-grid { grid-template-columns: 1fr; }
        }
        @media(max-width: 600px) {
          .pipeline { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-glow" />
        <div className="hiw-hero-inner">
          <p className="hiw-section-label">The Technology</p>
          <h1 className="hiw-h1">
            Not just the shortest path.<br />
            <em>The right one.</em>
          </h1>
          <p>
            NightPath is a graph problem plus a scoring model. Here&apos;s exactly how we turn lighting, footfall and community
            signals into a route you can trust — and how we&apos;re honest about what we don&apos;t know.
          </p>
          <div className="hiw-hero-formula">
            cost = f( <em>distance</em>, <em>time</em>, <em>safety_score</em>, <em>your weights</em> )
          </div>
        </div>
      </section>

      {/* ── STICKY TOC ── */}
      <div className="hiw-toc">
        <div className="hiw-toc-inner">
          <a href="#pipeline">Pipeline</a>
          <a href="#model">Scoring model</a>
          <a href="#decay">Time decay</a>
          <a href="#data">Datasets</a>
          <a href="#faq">FAQ</a>
        </div>
      </div>

      {/* ── PIPELINE ── */}
      <section className="hiw-section" id="pipeline">
        <div className="hiw-wrap">
          <div style={{ textAlign: 'center' }}>
            <p className="hiw-section-label">Core Architecture</p>
            <h2 className="hiw-h2">
              From road network to <em>optimal path</em>
            </h2>
            <p className="hiw-section-desc" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Five stages, run in under two seconds every time you search.
            </p>
          </div>

          <div className="pipeline">
            <div className="pl-node">
              <div className="pl-num">STAGE 01</div>
              <span className="pl-icon">🗺️</span>
              <div className="pl-title">Road Graph</div>
              <div className="pl-desc">Mumbai&apos;s full street network pulled from OpenStreetMap via OSMnx. 95k+ nodes.</div>
            </div>
            <div className="pl-node">
              <div className="pl-num">STAGE 02</div>
              <span className="pl-icon">🔬</span>
              <div className="pl-title">Feature Extraction</div>
              <div className="pl-desc">Per-edge lighting, footfall, incident history and road type attached to each segment.</div>
            </div>
            <div className="pl-node hl">
              <div className="pl-num">STAGE 03</div>
              <span className="pl-icon">🧠</span>
              <div className="pl-title">Night Safety Score</div>
              <div className="pl-desc">A model predicts a 0–100 safety score for every edge, conditioned on time of night.</div>
            </div>
            <div className="pl-node">
              <div className="pl-num">STAGE 04</div>
              <span className="pl-icon">⚖️</span>
              <div className="pl-title">Composite Weight</div>
              <div className="pl-desc">Distance, time and safety are fused using your personal preference weights.</div>
            </div>
            <div className="pl-node">
              <div className="pl-num">STAGE 05</div>
              <span className="pl-icon">🎯</span>
              <div className="pl-title">Modified Dijkstra</div>
              <div className="pl-desc">Calculates Safest, Balanced, and Fastest corridors under that weight function.</div>
            </div>
          </div>

          {/* Edge Box */}
          <div className="edge-grid">
            <div>
              <p className="hiw-section-label">Per-Edge Features</p>
              <h2 className="hiw-h2" style={{ fontSize: '1.9rem' }}>
                What we measure on <em>every road segment</em>
              </h2>
              <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'rgba(139,190,178,0.55)', lineHeight: 1.8 }}>
                A route isn&apos;t scored as a whole — it&apos;s the sum of its parts. Each segment carries its own signals, so a well-lit main road can absorb one dark stretch without hiding it.
              </p>
            </div>
            <div className="edge-box">
              <div className="eb-title">Sample edge · Sion–Trombay Rd</div>
              <div className="eb-sub">Segment 2 of 5 · 11:40 PM</div>
              <div className="feat-row">
                <div className="fr-ico">💡</div>
                <div className="fr-t">Lighting density<em>OSM lit tag + VIIRS nightlight</em></div>
                <div className="fr-w">0.87</div>
              </div>
              <div className="feat-row">
                <div className="fr-ico">👥</div>
                <div className="fr-t">Footfall proxy<em>POI density &amp; transit stops</em></div>
                <div className="fr-w">0.91</div>
              </div>
              <div className="feat-row">
                <div className="fr-ico">🏪</div>
                <div className="fr-t">Open-late POIs<em>Shops, pharmacies, ATMs within 50 m</em></div>
                <div className="fr-w">0.74</div>
              </div>
              <div className="feat-row">
                <div className="fr-ico">🛣️</div>
                <div className="fr-t">Road type<em>Arterial vs. service lane</em></div>
                <div className="fr-w">0.80</div>
              </div>
              <div className="feat-row">
                <div className="fr-ico">📍</div>
                <div className="fr-t">Community reports<em>Time-decayed weight</em></div>
                <div className="fr-w">0.95</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCORING MODEL ── */}
      <section className="hiw-section alt" id="model">
        <div className="hiw-wrap">
          <div style={{ textAlign: 'center' }}>
            <p className="hiw-section-label">The Scoring Model</p>
            <h2 className="hiw-h2">
              Your weights, <em>your route</em>
            </h2>
            <p className="hiw-section-desc" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Different commuters weigh factors differently. Drag the sliders and watch the cost function respond.
            </p>
          </div>

          <div className="model-layout">
            <div className="weight-card">
              <div className="wc-title">Try the cost function</div>
              <div className="wc-sub">Same road, three routes. Change what you care about and the winner changes.</div>
              <div className="sl-row">
                <label>💡 Lighting</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.light}
                  onChange={(e) => setWeights({ ...weights, light: +e.target.value })}
                />
                <span className="sv">{weights.light}</span>
              </div>
              <div className="sl-row">
                <label>👥 Footfall</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.crowd}
                  onChange={(e) => setWeights({ ...weights, crowd: +e.target.value })}
                />
                <span className="sv">{weights.crowd}</span>
              </div>
              <div className="sl-row">
                <label>🏪 Open shops</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.shops}
                  onChange={(e) => setWeights({ ...weights, shops: +e.target.value })}
                />
                <span className="sv">{weights.shops}</span>
              </div>
              <div className="sl-row">
                <label>⚡ Speed</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={weights.speed}
                  onChange={(e) => setWeights({ ...weights, speed: +e.target.value })}
                />
                <span className="sv">{weights.speed}</span>
              </div>

              <div className="result-box">
                <div className="rb-row"><span>⚡ Fastest route</span><b>{sFast} / 10</b></div>
                <div className="rb-row"><span>🏙️ Main road route</span><b>{sMain} / 10</b></div>
                <div className="rb-row"><span>✦ NightPath route</span><b>{sSafe} / 10</b></div>
                <div className="rb-big"><span>Recommended</span><b>{winner}</b></div>
              </div>
            </div>

            <div>
              <div className="algo-card">
                <div className="ac-label">Composite edge weight formula</div>
                <div className="hiw-code">
                  <span className="c"># per road segment e at time t</span><br />
                  w(e) = <span className="k">α</span> · length(e) + <span className="k">β</span> · (1 − safety_score(e, t)) × penalty
                </div>
                <div className="algo-note">
                  The safety term is <strong>time-conditioned</strong> — the same street scores differently at 7 PM and 11 PM — so time-awareness is built directly into our OSMnx graph edge attributes.
                </div>
              </div>

              <div className="algo-card">
                <div className="ac-label">Transparent by design</div>
                <div className="algo-note" style={{ marginTop: 0 }}>
                  We never return an unexplainable route. Every suggestion comes with <strong>visible trade-offs</strong>: <em>&quot;6 minutes longer, but 3× the lighting and 4 open shops.&quot;</em> You stay in full control.
                </div>
              </div>

              <div className="algo-card" style={{ marginBottom: 0 }}>
                <div className="ac-label">Transition-point risk</div>
                <div className="algo-note" style={{ marginTop: 0 }}>
                  The riskiest part of a night journey is often the <strong>wait</strong> or transition — a dark auto stand at midnight, or the last 200 m to an alley gate. We integrate <strong>Google Street View previews</strong> so commuters inspect drop-offs beforehand.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIME DECAY ── */}
      <section className="hiw-section" id="decay">
        <div className="hiw-wrap">
          <div className="decay-layout">
            <div>
              <p className="hiw-section-label">Time-Decayed Reports</p>
              <h2 className="hiw-h2">
                A living map, <em>not a stale one</em>
              </h2>
              <p style={{ fontSize: '0.92rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(139,190,178,0.58)', marginBottom: '1.2rem' }}>
                A hazard flagged at 9 PM shouldn&apos;t still be penalising your route at 3 AM. Community reports lose weight exponentially over hours — unless other users keep confirming them.
              </p>
              <div className="algo-card" style={{ marginBottom: 0 }}>
                <div className="ac-label">Exponential decay equation</div>
                <div className="hiw-code">weight(t) = confidence × e<sup>−λ · Δhours</sup></div>
                <div className="algo-note">
                  Confirmations reset the clock. Reports with zero community re-verifications fade smoothly into the background.
                </div>
              </div>
            </div>

            <div className="decay-card">
              <div className="dc-chart">
                <svg viewBox="0 0 400 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hiw-dgr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e6f9af" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#e6f9af" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(139,190,178,0.12)" strokeDasharray="4,4" />
                  <path fill="url(#hiw-dgr)" d={dAreaPath} />
                  <path stroke="#e6f9af" strokeWidth="3" fill="none" d={dLinePath} />
                  <circle r="6" fill="#8bbeb2" cx={dotX} cy={dotY} />
                </svg>
              </div>
              <div className="dc-axis">
                <span>0 h</span>
                <span>6 h</span>
                <span>12 h</span>
                <span>18 h</span>
                <span>24 h</span>
              </div>
              <div className="dc-ctrl">
                <label>Decay rate λ</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.05"
                  value={decayParams.lambda}
                  onChange={(e) => setDecayParams({ ...decayParams, lambda: +e.target.value })}
                />
                <b>{decayParams.lambda} / hr</b>
              </div>
              <div className="dc-ctrl" style={{ marginTop: '0.7rem' }}>
                <label>Report age</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={decayParams.age}
                  onChange={(e) => setDecayParams({ ...decayParams, age: +e.target.value })}
                />
                <b>{decayParams.age} h</b>
              </div>
              <div className="dc-stat">
                <div className="dcs"><div className="dcs-v">{weightNow}%</div><div className="dcs-l">Weight now</div></div>
                <div className="dcs"><div className="dcs-v">{halfLife} h</div><div className="dcs-l">Half-life</div></div>
                <div className="dcs"><div className="dcs-v">{impact}</div><div className="dcs-l">Route impact</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DATASETS ── */}
      <section className="hiw-section alt" id="data">
        <div className="hiw-wrap">
          <div style={{ textAlign: 'center' }}>
            <p className="hiw-section-label">Data Sources</p>
            <h2 className="hiw-h2">
              Built on data that <em>already exists</em>
            </h2>
            <p className="hiw-section-desc" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              We layer public and open sources — and are upfront about coverage in Indian metropolitan areas.
            </p>
          </div>

          <div className="ds-grid">
            <div className="ds-card">
              <div className="ds-head">
                <div className="ds-ico">🗺️</div>
                <div className="ds-name">Road network &amp; base map</div>
                <span className="cov cov-hi">Strong</span>
              </div>
              <div className="ds-list">
                <div className="ds-item"><div>OpenStreetMap via OSMnx<em>Mumbai&apos;s full 95k+ node street graph</em></div></div>
                <div className="ds-item"><div>BMC GIS REST API<em>Ward boundaries and administrative infrastructure layers</em></div></div>
                <div className="ds-item"><div>Overpass API<em>Live dynamic queries for pharmacies, chowkis &amp; safe havens</em></div></div>
              </div>
              <div className="ds-note">Full pedestrian sidewalks, primary expressways, and service lanes mapped in graph memory.</div>
            </div>

            <div className="ds-card">
              <div className="ds-head">
                <div className="ds-ico">💡</div>
                <div className="ds-name">Lighting &amp; Illumination</div>
                <span className="cov cov-mid">Hybrid</span>
              </div>
              <div className="ds-list">
                <div className="ds-item"><div>OSM <code style={{ color: 'var(--teal)' }}>lit=yes/no</code> tags<em>Verified illuminated corridors and major links</em></div></div>
                <div className="ds-item"><div>VIIRS Day/Night Band Satellite<em>Area-level radiance proxy for nighttime ambient luminosity</em></div></div>
                <div className="ds-item"><div>Google Street View Metadata<em>Corroborating physical lamp posts and commercial storefronts</em></div></div>
              </div>
              <div className="ds-note">Where street lamp counts are missing, we combine radiance with commercial shop front density.</div>
            </div>

            <div className="ds-card">
              <div className="ds-head">
                <div className="ds-ico">🏪</div>
                <div className="ds-name">Footfall &amp; POI Presence</div>
                <span className="cov cov-hi">Precise</span>
              </div>
              <div className="ds-list">
                <div className="ds-item"><div>Google Places API (New)<em>24/7 pharmacies, hospitals, transit terminals, ATM lobbies</em></div></div>
                <div className="ds-item"><div>Mumbai Local Stations<em>Station platform egresses and taxi stands</em></div></div>
              </div>
              <div className="ds-note">High commercial vibrancy correlates strongly with natural surveillance and bystander safety.</div>
            </div>

            <div className="ds-card">
              <div className="ds-head">
                <div className="ds-ico">👥</div>
                <div className="ds-name">Community Hazard Reports</div>
                <span className="cov cov-hi">Real-Time</span>
              </div>
              <div className="ds-list">
                <div className="ds-item"><div>Decaying Crowdsourced Pins<em>Waterlogging, broken lighting, harassment, isolated stretches</em></div></div>
                <div className="ds-item"><div>Supabase Cloud Sync<em>Fast broadcast to all commuters traversing the vicinity</em></div></div>
              </div>
              <div className="ds-note">Validated by community thumbs and exponential half-life decay timers.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="hiw-section" id="faq">
        <div className="hiw-wrap">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="hiw-section-label">Questions &amp; Answers</p>
            <h2 className="hiw-h2">
              Frequently asked <em>questions</em>
            </h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq ${isOpen ? 'open' : ''}`}>
                  <div className="faq-q" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                    <span>{faq.q}</span>
                    <span className="faq-i">{isOpen ? '✕' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className="faq-a">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
              className="lp-btn-primary"
              style={{
                background: 'var(--lime)',
                color: 'var(--deep)',
                padding: '0.9rem 2.4rem',
                borderRadius: '100px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              🌙 Try Route Planner Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
