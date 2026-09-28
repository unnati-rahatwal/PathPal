import React, { useState } from 'react';

export default function CorporateMode({ onNavigate }) {
  const [empCount, setEmpCount] = useState(300);
  const [planTier, setPlanTier] = useState(2);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    staff: '100 – 500',
    hub: 'Powai',
    notes: ''
  });

  const plans = {
    1: ['Starter', 50],
    2: ['Growth', 75],
    3: ['Enterprise', 100]
  };

  const currentPlan = plans[planTier];
  const monthlyCost = empCount * currentPlan[1];
  const annualCost = monthlyCost * 12;

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="corporate-page text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .corporate-page {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .corp-hero {
          min-height: 88vh;
          display: flex;
          align-items: center;
          padding: 8rem 2.5rem 4rem;
          position: relative;
          overflow: hidden;
          background: var(--deep);
        }
        .corp-hero-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .corp-hero-glow {
          position: absolute;
          top: 5%;
          right: -5%;
          width: 650px;
          height: 650px;
          background: radial-gradient(ellipse, rgba(56,78,119,0.55) 0%, transparent 60%);
          pointer-events: none;
        }
        .corp-hero-inner {
          max-width: 1150px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .corp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(56,78,119,0.5);
          border: 1px solid rgba(139,190,178,0.25);
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 1.6rem;
        }
        .corp-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 4.6vw, 4rem);
          font-weight: 900;
          line-height: 1.06;
          color: var(--lime);
          margin-bottom: 1.3rem;
        }
        .corp-h1 em {
          font-style: italic;
          color: var(--teal);
        }
        .corp-p {
          font-size: 1.02rem;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(230,249,175,0.65);
          max-width: 500px;
          margin-bottom: 2rem;
        }
        .corp-hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.2rem;
        }
        .corp-btn-primary {
          background: var(--lime);
          color: var(--deep);
          padding: 0.9rem 2.1rem;
          border: none;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .corp-btn-primary:hover {
          background: var(--teal);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(139,190,178,0.25);
        }
        .corp-btn-secondary {
          background: transparent;
          color: var(--teal);
          padding: 0.9rem 2.1rem;
          border: 1px solid rgba(139,190,178,0.35);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .corp-btn-secondary:hover {
          border-color: var(--teal);
          background: rgba(139,190,178,0.08);
        }
        .corp-trust-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          font-size: 0.76rem;
          color: rgba(139,190,178,0.55);
        }
        .corp-trust-row span::before {
          content: '✓ ';
          color: var(--teal);
        }

        /* HERO DASHBOARD PREVIEW */
        .dash-preview {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 22px;
          padding: 1.3rem;
          box-shadow: 0 24px 70px rgba(13,6,48,0.6);
        }
        .dp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .dp-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--lime);
        }
        .dp-live {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal);
        }
        .dp-live::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--lime);
          animation: blink 2s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .dp-kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-bottom: 0.9rem;
        }
        .dp-kpi {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 12px;
          padding: 0.7rem 0.8rem;
        }
        .dp-kv {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }
        .dp-kl {
          font-size: 0.58rem;
          color: rgba(139,190,178,0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.25rem;
        }
        .dp-map {
          height: 150px;
          background: rgba(13,6,48,0.55);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.9rem;
        }
        .dp-map-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        .dp-map svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .cab {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--lime);
          box-shadow: 0 0 10px rgba(230,249,175,0.6);
        }
        .cab.teal {
          background: var(--teal);
          box-shadow: 0 0 10px rgba(139,190,178,0.6);
        }
        .dp-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .dp-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.08);
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          font-size: 0.72rem;
        }
        .dp-row .n {
          flex: 1;
          color: rgba(230,249,175,0.8);
        }
        .dp-row .n em {
          font-style: normal;
          color: rgba(139,190,178,0.45);
          font-size: 0.65rem;
          display: block;
        }
        .pill {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.15rem 0.55rem;
          border-radius: 100px;
        }
        .p-ok {
          background: rgba(139,190,178,0.12);
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.22);
        }
        .p-flag {
          background: rgba(230,249,175,0.1);
          color: var(--lime);
          border: 1px solid rgba(230,249,175,0.22);
        }

        /* SECTIONS */
        .section {
          padding: 5.5rem 2.5rem;
        }
        .section.alt {
          background: var(--navy);
          border-top: 1px solid rgba(139,190,178,0.08);
          border-bottom: 1px solid rgba(139,190,178,0.08);
        }
        .section.slate {
          background: var(--slate);
          position: relative;
          overflow: hidden;
        }
        .section.slate::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(139,190,178,0.06) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .center {
          text-align: center;
        }
        .section-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.7rem;
        }
        .corp-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.4vw, 2.7rem);
          font-weight: 700;
          color: var(--lime);
          line-height: 1.15;
          margin-bottom: 0.9rem;
        }
        .corp-h2 em {
          font-style: italic;
          color: var(--teal);
        }
        .section-desc {
          font-size: 0.94rem;
          font-weight: 300;
          color: rgba(139,190,178,0.55);
          line-height: 1.75;
          max-width: 580px;
          margin-bottom: 3rem;
        }
        .center .section-desc {
          margin-left: auto;
          margin-right: auto;
        }

        /* PROBLEM STATS */
        .prob-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.3rem;
        }
        .prob {
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 22px;
          padding: 1.9rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s, border-color 0.25s;
        }
        .prob:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .prob::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        .prob:nth-child(1)::before {
          background: linear-gradient(90deg, var(--lime), transparent);
        }
        .prob:nth-child(2)::before {
          background: linear-gradient(90deg, var(--teal), transparent);
        }
        .prob:nth-child(3)::before {
          background: linear-gradient(90deg, rgba(56,78,119,0.9), transparent);
        }
        .prob-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }
        .prob-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.6rem;
        }
        .prob-desc {
          font-size: 0.84rem;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(139,190,178,0.55);
        }

        /* SPLIT FEATURE */
        .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
          margin-bottom: 5rem;
        }
        .split:last-child {
          margin-bottom: 0;
        }
        .split.rev .split-copy {
          order: 2;
        }
        .split-copy p {
          font-size: 0.92rem;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(139,190,178,0.58);
          margin-bottom: 1.4rem;
        }
        .check-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .ck {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          font-size: 0.84rem;
          color: rgba(230,249,175,0.75);
          line-height: 1.55;
        }
        .ck::before {
          content: '✓';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(139,190,178,0.15);
          border: 1px solid rgba(139,190,178,0.3);
          color: var(--teal);
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .panel {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 22px;
          padding: 1.5rem;
        }
        .panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .panel-title span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          color: rgba(139,190,178,0.45);
          font-weight: 400;
        }

        /* Route audit table */
        .audit-row {
          display: grid;
          grid-template-columns: 1.4fr 0.7fr 0.6fr 0.7fr;
          gap: 0.5rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(139,190,178,0.07);
          align-items: center;
          font-size: 0.78rem;
        }
        .audit-row:last-child {
          border-bottom: none;
        }
        .audit-head {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.4);
          padding-top: 0;
        }
        .a-name {
          color: var(--lime);
          font-weight: 500;
        }
        .a-name em {
          display: block;
          font-style: normal;
          color: rgba(139,190,178,0.4);
          font-size: 0.65rem;
          font-weight: 300;
        }
        .a-score {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          color: var(--lime);
        }
        .a-score.lo {
          color: rgba(139,190,178,0.5);
        }

        /* Corridor visual */
        .corridor {
          height: 200px;
          background: rgba(13,6,48,0.55);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .corridor svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .cor-legend {
          display: flex;
          gap: 1.2rem;
          font-size: 0.7rem;
          color: rgba(139,190,178,0.55);
          flex-wrap: wrap;
        }
        .cor-legend span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .cl-line {
          width: 18px;
          height: 3px;
          border-radius: 2px;
          display: inline-block;
        }

        /* Compliance report */
        .rep-doc {
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 16px;
          padding: 1.3rem;
        }
        .rd-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 0.9rem;
          border-bottom: 1px solid rgba(139,190,178,0.1);
        }
        .rd-t {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--lime);
        }
        .rd-s {
          font-size: 0.66rem;
          color: rgba(139,190,178,0.45);
          margin-top: 0.2rem;
        }
        .rd-badge {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          background: rgba(230,249,175,0.1);
          color: var(--lime);
          border: 1px solid rgba(230,249,175,0.22);
        }
        .rd-line {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.78rem;
          border-bottom: 1px solid rgba(139,190,178,0.06);
        }
        .rd-line:last-of-type {
          border-bottom: none;
        }
        .rd-line span:first-child {
          color: rgba(139,190,178,0.55);
        }
        .rd-line span:last-child {
          color: var(--lime);
          font-weight: 500;
        }
        .rd-bar {
          margin-top: 0.9rem;
        }
        .rd-bar-l {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 0.35rem;
        }
        .rd-track {
          height: 6px;
          background: rgba(13,6,48,0.6);
          border-radius: 100px;
          overflow: hidden;
        }
        .rd-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--teal), var(--lime));
          border-radius: 100px;
          width: 96%;
        }
        .dl-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 1rem;
        }
        .dl-btn {
          flex: 1;
          background: transparent;
          border: 1px solid rgba(139,190,178,0.22);
          border-radius: 100px;
          padding: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: var(--teal);
          cursor: pointer;
          transition: all 0.2s;
        }
        .dl-btn:hover {
          border-color: var(--teal);
          background: rgba(139,190,178,0.08);
        }

        /* HUBS */
        .hub-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .hub {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 18px;
          padding: 1.3rem;
          text-align: center;
          transition: transform 0.25s, border-color 0.25s;
        }
        .hub:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .hub-icon {
          font-size: 1.8rem;
          display: block;
          margin-bottom: 0.6rem;
        }
        .hub-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--lime);
          margin-bottom: 0.2rem;
        }
        .hub-sub {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.5);
          line-height: 1.5;
        }
        .hub-tag {
          display: inline-block;
          margin-top: 0.7rem;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.18rem 0.6rem;
          border-radius: 100px;
          background: rgba(139,190,178,0.1);
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.2);
        }

        /* PRICING / ROI */
        .price-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .roi-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 24px;
          padding: 2rem;
        }
        .roi-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
        }
        .roi-sub {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.6rem;
        }
        .roi-row {
          margin-bottom: 1.4rem;
        }
        .roi-lab {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(230,249,175,0.75);
          margin-bottom: 0.6rem;
        }
        .roi-lab b {
          color: var(--teal);
          font-weight: 600;
        }
        .roi-row input[type=range] {
          width: 100%;
          accent-color: var(--teal);
        }
        .roi-out {
          background: rgba(230,249,175,0.07);
          border: 1px solid rgba(230,249,175,0.2);
          border-radius: 16px;
          padding: 1.2rem;
          text-align: center;
          margin-top: 1.5rem;
        }
        .ro-l {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.5);
          margin-bottom: 0.3rem;
        }
        .ro-v {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }
        .ro-n {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.5);
          margin-top: 0.4rem;
        }

        .tiers {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .tier {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          gap: 1.2rem;
          align-items: flex-start;
          transition: border-color 0.2s;
        }
        .tier:hover {
          border-color: rgba(139,190,178,0.3);
        }
        .tier.pop {
          border-color: var(--teal);
          background: rgba(56,78,119,0.3);
        }
        .tier-l {
          flex: 1;
        }
        .tier-n {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.2rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .tier-n span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--lime);
          color: var(--deep);
          padding: 0.15rem 0.6rem;
          border-radius: 100px;
        }
        .tier-for {
          font-size: 0.74rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 0.8rem;
        }
        .tier-f {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .tier-f div {
          font-size: 0.76rem;
          color: rgba(230,249,175,0.7);
          display: flex;
          gap: 0.5rem;
        }
        .tier-f div::before {
          content: '→';
          color: var(--teal);
        }
        .tier-r {
          text-align: right;
          flex-shrink: 0;
        }
        .tier-p {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }
        .tier-u {
          font-size: 0.65rem;
          color: rgba(139,190,178,0.45);
          margin-top: 0.2rem;
        }

        /* B2G */
        .b2g {
          background: linear-gradient(135deg, rgba(56,78,119,0.4), rgba(24,49,79,0.95));
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 28px;
          padding: 2.8rem;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .b2g p {
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.8;
          color: rgba(139,190,178,0.6);
          margin-bottom: 1.4rem;
        }
        .gap-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .gap-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 14px;
          padding: 0.85rem 1.1rem;
        }
        .gi-ico {
          font-size: 1.3rem;
        }
        .gi-t {
          flex: 1;
          font-size: 0.8rem;
          color: var(--lime);
          font-weight: 500;
        }
        .gi-t em {
          display: block;
          font-style: normal;
          font-size: 0.66rem;
          color: rgba(139,190,178,0.45);
          font-weight: 300;
          margin-top: 0.1rem;
        }
        .gi-n {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--teal);
          text-align: right;
        }
        .gi-n span {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          color: rgba(139,190,178,0.4);
          font-weight: 400;
        }

        /* CONTACT FORM */
        .contact {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .contact-perks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.6rem;
        }
        .perk {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .perk-ico {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          flex-shrink: 0;
        }
        .perk-t strong {
          display: block;
          font-size: 0.88rem;
          color: var(--lime);
          font-weight: 500;
          margin-bottom: 0.15rem;
        }
        .perk-t span {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.55);
          line-height: 1.5;
        }
        .form-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(13,6,48,0.4);
        }
        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
        }
        .form-sub {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.4rem;
        }
        .fg {
          margin-bottom: 0.95rem;
        }
        .fl {
          display: block;
          font-size: 0.66rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.45);
          margin-bottom: 0.4rem;
        }
        .fi {
          width: 100%;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.18);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: var(--lime);
          outline: none;
          transition: border-color 0.2s;
        }
        .fi::placeholder {
          color: rgba(139,190,178,0.25);
        }
        .fi:focus {
          border-color: rgba(139,190,178,0.5);
        }
        .fi option {
          background: var(--navy);
        }
        .fr {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }
        .submit {
          width: 100%;
          background: var(--lime);
          color: var(--deep);
          border: none;
          border-radius: 100px;
          padding: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .submit:hover {
          background: var(--teal);
          transform: translateY(-1px);
        }
        .form-note {
          font-size: 0.7rem;
          color: rgba(139,190,178,0.4);
          text-align: center;
          margin-top: 0.8rem;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: var(--teal);
          color: var(--deep);
          padding: 0.9rem 2rem;
          border-radius: 100px;
          font-weight: 500;
          font-size: 0.88rem;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          z-index: 400;
        }
        .toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        @media(max-width: 1000px) {
          .corp-hero-inner, .split, .price-layout, .b2g, .contact {
            grid-template-columns: 1fr;
          }
          .split.rev .split-copy {
            order: 0;
          }
          .prob-grid, .hub-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media(max-width: 600px) {
          .prob-grid, .hub-grid, .fr {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="corp-hero">
        <div className="corp-hero-grid" />
        <div className="corp-hero-glow" />
        <div className="corp-hero-inner">
          <div>
            <div className="corp-badge">🏢 NightPath for Business</div>
            <h1 className="corp-h1">
              Late shifts shouldn&apos;t mean <em>late worries.</em>
            </h1>
            <p className="corp-p">
              A route-auditing dashboard and drop-off routing API that sends every employee home along verified,
              well-lit, CCTV-dense corridors — not isolated alleys. Duty of care, documented.
            </p>
            <div className="corp-hero-actions">
              <a href="#demo" className="corp-btn-primary">
                📅 Book a Demo
              </a>
              <a href="#pricing" className="corp-btn-secondary">
                See Pricing →
              </a>
            </div>
            <div className="corp-trust-row">
              <span>Built for Mumbai&apos;s night economy</span>
              <span>API + dashboard</span>
              <span>Compliance-ready reports</span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW WIDGET */}
          <div className="dash-preview">
            <div className="dp-top">
              <div className="dp-title">Tonight&apos;s Fleet · Powai Hub</div>
              <div className="dp-live">Live</div>
            </div>
            <div className="dp-kpis">
              <div className="dp-kpi">
                <div className="dp-kv">142</div>
                <div className="dp-kl">Employees en route</div>
              </div>
              <div className="dp-kpi">
                <div className="dp-kv">96%</div>
                <div className="dp-kl">On safe corridors</div>
              </div>
              <div className="dp-kpi">
                <div className="dp-kv">3</div>
                <div className="dp-kl">Reroutes flagged</div>
              </div>
            </div>
            <div className="dp-map">
              <div className="dp-map-grid" />
              <svg viewBox="0 0 400 150" preserveAspectRatio="none">
                <path
                  d="M20,120 Q100,60 190,80 T380,30"
                  stroke="rgba(230,249,175,0.75)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6,4"
                />
                <path
                  d="M40,130 Q140,110 240,105 T380,90"
                  stroke="rgba(139,190,178,0.6)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="6,4"
                />
                <path
                  d="M20,70 Q120,40 220,50 T370,60"
                  stroke="rgba(139,190,178,0.25)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <div className="cab" style={{ top: '52%', left: '38%' }} />
              <div className="cab teal" style={{ top: '68%', left: '62%' }} />
              <div className="cab" style={{ top: '30%', left: '78%' }} />
              <div className="cab teal" style={{ top: '44%', left: '22%' }} />
            </div>
            <div className="dp-list">
              <div className="dp-row">
                <span>🚖</span>
                <div className="n">
                  Cab MH-01 4471 · Powai → Chembur
                  <em>Corridor score 9.1</em>
                </div>
                <span className="pill p-ok">On route</span>
              </div>
              <div className="dp-row">
                <span>🚖</span>
                <div className="n">
                  Cab MH-02 8830 · Airoli → Ghatkopar
                  <em>Diverted from unlit lane</em>
                </div>
                <span className="pill p-flag">Rerouted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="section alt" id="product">
        <div className="wrap center">
          <p className="section-label">The Duty-of-Care Gap</p>
          <h2 className="corp-h2">
            Companies are responsible.<br />
            <em>Cab vendors just pick the shortest road.</em>
          </h2>
          <p className="section-desc">
            BPOs, IT hubs and media agencies running late shifts are legally expected to ensure safe night transit —
            but standard fleet routing optimises for time and distance only.
          </p>
          <div className="prob-grid" style={{ textAlign: 'left' }}>
            <div className="prob">
              <span className="prob-icon">⚖️</span>
              <div className="prob-title">Legal obligation, no tooling</div>
              <div className="prob-desc">
                Employers must provide safe night-time transport, yet have no way to verify the actual roads a vendor
                cab uses or prove they chose a safe one.
              </div>
            </div>
            <div className="prob">
              <span className="prob-icon">🛣️</span>
              <div className="prob-title">Fastest ≠ safest</div>
              <div className="prob-desc">
                Drivers take unlit service lanes and shortcuts to save minutes. Nothing in existing fleet software scores
                lighting, footfall or isolation.
              </div>
            </div>
            <div className="prob">
              <span className="prob-icon">📄</span>
              <div className="prob-title">No audit trail</div>
              <div className="prob-desc">
                When an incident is investigated, there&apos;s no data on which corridor was used, how safe it was, or
                whether a safer option existed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT SPLITS ── */}
      <section className="section">
        <div className="wrap">
          {/* Split 1 */}
          <div className="split">
            <div className="split-copy">
              <p className="section-label">Route-Auditing Dashboard</p>
              <h2 className="corp-h2">
                See exactly which <em>roads</em> your cabs use
              </h2>
              <p>
                Every employee drop is scored against the same lighting, footfall and isolation model our commuter app
                uses. Spot risky vendor habits, compare routes, and act before an incident — not after.
              </p>
              <div className="check-list">
                <div className="ck">Live fleet view with corridor safety score per trip</div>
                <div className="ck">Automatic flags when a cab leaves the approved corridor</div>
                <div className="ck">Vendor scorecards ranked by safe-route adherence</div>
                <div className="ck">Employee-facing ETA and safe-arrival confirmation</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-title">
                Vendor Route Audit <span>Last 7 nights</span>
              </div>
              <div className="audit-row audit-head">
                <span>Vendor / Route</span>
                <span>Trips</span>
                <span>Score</span>
                <span>Status</span>
              </div>
              <div className="audit-row">
                <div className="a-name">
                  CityCabs Pvt Ltd<em>Powai → Chembur</em>
                </div>
                <span>412</span>
                <span className="a-score">9.0</span>
                <span className="pill p-ok">Compliant</span>
              </div>
              <div className="audit-row">
                <div className="a-name">
                  SafeRide Fleet<em>Airoli → Ghatkopar</em>
                </div>
                <span>288</span>
                <span className="a-score">8.4</span>
                <span className="pill p-ok">Compliant</span>
              </div>
              <div className="audit-row">
                <div className="a-name">
                  Metro Movers<em>BKC → Kurla West</em>
                </div>
                <span>196</span>
                <span className="a-score lo">6.1</span>
                <span className="pill p-flag">Review</span>
              </div>
              <div className="audit-row">
                <div className="a-name">
                  NightOwl Transit<em>Lower Parel → Dadar</em>
                </div>
                <span>351</span>
                <span className="a-score">8.9</span>
                <span className="pill p-ok">Compliant</span>
              </div>
            </div>
          </div>

          {/* Split 2 */}
          <div className="split rev">
            <div className="split-copy">
              <p className="section-label">Drop-off Routing API</p>
              <h2 className="corp-h2">
                Plug safety into <em>your existing</em> fleet system
              </h2>
              <p>
                Already using a cab-management tool? Send us pickup and drop points and get back the safest corridor —
                ranked, explained, and ready to hand to your vendor&apos;s driver app.
              </p>
              <div className="check-list">
                <div className="ck">REST API · returns route, score and per-segment reasons</div>
                <div className="ck">Batch optimisation for shared multi-drop cabs</div>
                <div className="ck">Time-of-night risk weighting built in</div>
                <div className="ck">Works as a layer on top of existing map providers</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-title">
                Verified Corridor <span>Powai → Chembur · 11:40 PM</span>
              </div>
              <div className="corridor">
                <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path
                    d="M20,170 Q90,110 170,125 T300,60 T385,35"
                    stroke="rgba(56,78,119,0.7)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4,5"
                  />
                  <path
                    d="M20,170 Q100,150 190,160 T380,140"
                    stroke="rgba(139,190,178,0.35)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M20,170 Q80,80 170,90 T310,80 T385,35"
                    stroke="#e6f9af"
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray="7,4"
                  />
                  <circle cx="20" cy="170" r="7" fill="#e6f9af" />
                  <circle cx="385" cy="35" r="7" fill="#8bbeb2" />
                  <circle cx="95" cy="98" r="4" fill="rgba(230,249,175,0.55)" />
                  <circle cx="175" cy="90" r="4" fill="rgba(230,249,175,0.55)" />
                  <circle cx="255" cy="84" r="4" fill="rgba(230,249,175,0.55)" />
                  <circle cx="335" cy="60" r="4" fill="rgba(230,249,175,0.55)" />
                </svg>
              </div>
              <div className="cor-legend">
                <span>
                  <i className="cl-line" style={{ background: '#e6f9af' }} />
                  Verified corridor · 9.1
                </span>
                <span>
                  <i className="cl-line" style={{ background: 'rgba(139,190,178,0.4)' }} />
                  Shortest · 4.3
                </span>
                <span>
                  <i className="cl-line" style={{ background: 'rgba(56,78,119,0.8)' }} />
                  Isolated lane
                </span>
              </div>
            </div>
          </div>

          {/* Split 3 */}
          <div className="split">
            <div className="split-copy">
              <p className="section-label">Compliance Reporting</p>
              <h2 className="corp-h2">
                Prove your duty of care, <em>every quarter</em>
              </h2>
              <p>
                Auto-generated reports document which corridors your fleet used, safety scores, deviations and resolutions
                — the audit trail HR, legal and insurers ask for.
              </p>
              <div className="check-list">
                <div className="ck">Monthly and quarterly exports as PDF or CSV</div>
                <div className="ck">Per-employee safe-arrival log with timestamps</div>
                <div className="ck">Deviation and incident register</div>
                <div className="ck">Shareable with auditors and insurers</div>
              </div>
            </div>
            <div className="panel">
              <div className="rep-doc">
                <div className="rd-head">
                  <div>
                    <div className="rd-t">Night Transport Safety Report</div>
                    <div className="rd-s">Powai Hub · Mar 2025 · 9,840 trips</div>
                  </div>
                  <span className="rd-badge">Audit-ready</span>
                </div>
                <div className="rd-line">
                  <span>Trips on verified corridors</span>
                  <span>9,447 (96%)</span>
                </div>
                <div className="rd-line">
                  <span>Avg corridor safety score</span>
                  <span>8.8 / 10</span>
                </div>
                <div className="rd-line">
                  <span>Deviations flagged</span>
                  <span>41</span>
                </div>
                <div className="rd-line">
                  <span>Resolved within 24h</span>
                  <span>39</span>
                </div>
                <div className="rd-bar">
                  <div className="rd-bar-l">
                    <span>Compliance</span>
                    <span>96%</span>
                  </div>
                  <div className="rd-track">
                    <div className="rd-fill" />
                  </div>
                </div>
                <div className="dl-row">
                  <button type="button" className="dl-btn">
                    ⬇ PDF
                  </button>
                  <button type="button" className="dl-btn">
                    ⬇ CSV
                  </button>
                  <button type="button" className="dl-btn">
                    ✉ Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HUBS ── */}
      <section className="section slate">
        <div className="wrap center">
          <p className="section-label">Where We Start</p>
          <h2 className="corp-h2">
            Mumbai&apos;s <em>night-shift hubs</em>
          </h2>
          <p className="section-desc">
            We&apos;re launching where late-shift density is highest and the last-mile risk is greatest.
          </p>
          <div className="hub-grid">
            <div className="hub">
              <span className="hub-icon">🏙️</span>
              <div className="hub-name">Powai</div>
              <div className="hub-sub">IT parks &amp; Hiranandani corridor</div>
              <span className="hub-tag">Pilot hub</span>
            </div>
            <div className="hub">
              <span className="hub-icon">💻</span>
              <div className="hub-name">Airoli / Navi Mumbai</div>
              <div className="hub-sub">Mindspace &amp; tech campuses</div>
              <span className="hub-tag">Pilot hub</span>
            </div>
            <div className="hub">
              <span className="hub-icon">📰</span>
              <div className="hub-name">Lower Parel</div>
              <div className="hub-sub">Media agencies &amp; corporate towers</div>
              <span className="hub-tag">Phase 2</span>
            </div>
            <div className="hub">
              <span className="hub-icon">🏨</span>
              <div className="hub-name">BKC &amp; Andheri</div>
              <div className="hub-sub">Hospitality &amp; financial services</div>
              <span className="hub-tag">Phase 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING / ROI CALCULATOR ── */}
      <section className="section" id="pricing">
        <div className="wrap">
          <div className="center">
            <p className="section-label">Simple Pricing</p>
            <h2 className="corp-h2">
              Per employee, <em>per month.</em>
            </h2>
            <p className="section-desc">
              Annual SaaS contracts sized to your night-shift headcount. Only pay for employees you cover.
            </p>
          </div>
          <div className="price-layout">
            <div className="roi-card">
              <div className="roi-title">Estimate your cost</div>
              <div className="roi-sub">Drag to match your late-shift workforce.</div>
              <div className="roi-row">
                <div className="roi-lab">
                  <span>Night-shift employees</span>
                  <b>{empCount.toLocaleString('en-IN')}</b>
                </div>
                <input
                  type="range"
                  min="25"
                  max="2000"
                  step="25"
                  value={empCount}
                  onChange={(e) => setEmpCount(Number(e.target.value))}
                />
              </div>
              <div className="roi-row">
                <div className="roi-lab">
                  <span>Plan</span>
                  <b>
                    {currentPlan[0]} · ₹{currentPlan[1]}
                  </b>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={planTier}
                  onChange={(e) => setPlanTier(Number(e.target.value))}
                />
              </div>
              <div className="roi-out">
                <div className="ro-l">Estimated annual cost</div>
                <div className="ro-v">₹{annualCost.toLocaleString('en-IN')}</div>
                <div className="ro-n">
                  ₹{monthlyCost.toLocaleString('en-IN')} / month · ₹{currentPlan[1]} per employee
                </div>
              </div>
            </div>

            <div className="tiers">
              <div className={`tier ${planTier === 1 ? 'pop' : ''}`}>
                <div className="tier-l">
                  <div className="tier-n">Starter</div>
                  <div className="tier-for">Small teams &amp; single-site pilots</div>
                  <div className="tier-f">
                    <div>Route-auditing dashboard</div>
                    <div>Safe-arrival confirmations</div>
                    <div>Quarterly report export</div>
                  </div>
                </div>
                <div className="tier-r">
                  <div className="tier-p">₹50</div>
                  <div className="tier-u">per employee / mo</div>
                </div>
              </div>

              <div className={`tier ${planTier === 2 ? 'pop' : ''}`}>
                <div className="tier-l">
                  <div className="tier-n">
                    Growth <span>Popular</span>
                  </div>
                  <div className="tier-for">Multi-vendor fleets across hubs</div>
                  <div className="tier-f">
                    <div>Everything in Starter</div>
                    <div>Drop-off routing API</div>
                    <div>Vendor scorecards &amp; alerts</div>
                    <div>Monthly compliance reports</div>
                  </div>
                </div>
                <div className="tier-r">
                  <div className="tier-p">₹75</div>
                  <div className="tier-u">per employee / mo</div>
                </div>
              </div>

              <div className={`tier ${planTier === 3 ? 'pop' : ''}`}>
                <div className="tier-l">
                  <div className="tier-n">Enterprise</div>
                  <div className="tier-for">Large campuses &amp; regulated industries</div>
                  <div className="tier-f">
                    <div>Everything in Growth</div>
                    <div>Batch multi-drop optimisation</div>
                    <div>SSO, audit logs &amp; SLA</div>
                    <div>Dedicated success manager</div>
                  </div>
                </div>
                <div className="tier-r">
                  <div className="tier-p">₹100</div>
                  <div className="tier-u">per employee / mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── B2G CIVIC SECTION ── */}
      <section className="section alt" id="civic">
        <div className="wrap">
          <div className="b2g">
            <div>
              <p className="section-label">For Cities &amp; Municipalities</p>
              <h2 className="corp-h2">
                Turn avoided routes into <em>infrastructure insight</em>
              </h2>
              <p>
                When users repeatedly avoid a lane after 10 PM, that&apos;s a crowdsourced signal of a lighting or safety gap.
                Aggregated and anonymised, we package it into reports for the Brihanmumbai Municipal Corporation and
                Mumbai Traffic Police — showing where a new streetlight or night beat patrol would help most.
              </p>
              <a href="#demo" className="corp-btn-primary">
                Talk to our civic team →
              </a>
            </div>
            <div className="gap-list">
              <div className="gap-item">
                <span className="gi-ico">💡</span>
                <div className="gi-t">
                  Lane B, Kurla West<em>Avoided after 10 PM</em>
                </div>
                <div className="gi-n">
                  312<span>avoidances/wk</span>
                </div>
              </div>
              <div className="gap-item">
                <span className="gi-ico">🌑</span>
                <div className="gi-t">
                  Dharavi service lane<em>Dark stretch, 3 dead lamps</em>
                </div>
                <div className="gi-n">
                  248<span>avoidances/wk</span>
                </div>
              </div>
              <div className="gap-item">
                <span className="gi-ico">🚧</span>
                <div className="gi-t">
                  Sion underpass footpath<em>Waterlogging + broken paving</em>
                </div>
                <div className="gi-n">
                  187<span>avoidances/wk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO FORM ── */}
      <section className="section slate" id="demo">
        <div className="wrap">
          <div className="contact">
            <div>
              <p className="section-label">Get Started</p>
              <h2 className="corp-h2">
                See NightPath on <em>your fleet</em>
              </h2>
              <p style={{ fontSize: '0.94rem', fontWeight: 300, color: 'rgba(230,249,175,0.6)', lineHeight: 1.75, maxWidth: '460px' }}>
                Book a 30-minute walkthrough and we&apos;ll score a real route your employees take tonight.
              </p>
              <div className="contact-perks">
                <div className="perk">
                  <div className="perk-ico">🗺️</div>
                  <div className="perk-t">
                    <strong>Free route audit</strong>
                    <span>We score one of your existing night routes before the call.</span>
                  </div>
                </div>
                <div className="perk">
                  <div className="perk-ico">🚀</div>
                  <div className="perk-t">
                    <strong>Pilot in 2 weeks</strong>
                    <span>Start with a single hub and one vendor, then scale.</span>
                  </div>
                </div>
                <div className="perk">
                  <div className="perk-ico">🔒</div>
                  <div className="perk-t">
                    <strong>Privacy-first</strong>
                    <span>Employee location is sampled at decision nodes only.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-title">Book a demo</div>
              <div className="form-sub">We&apos;ll reply within one business day.</div>
              <form onSubmit={handleDemoSubmit}>
                <div className="fr">
                  <div className="fg">
                    <label className="fl">Your name</label>
                    <input
                      className="fi"
                      type="text"
                      required
                      placeholder="Anita Deshmukh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="fg">
                    <label className="fl">Work email</label>
                    <input
                      className="fi"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="fg">
                  <label className="fl">Company</label>
                  <input
                    className="fi"
                    type="text"
                    required
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="fr">
                  <div className="fg">
                    <label className="fl">Night-shift staff</label>
                    <select
                      className="fi"
                      value={formData.staff}
                      onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                    >
                      <option>Under 100</option>
                      <option>100 – 500</option>
                      <option>500 – 2,000</option>
                      <option>2,000+</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label className="fl">Main hub</label>
                    <select
                      className="fi"
                      value={formData.hub}
                      onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                    >
                      <option>Powai</option>
                      <option>Airoli / Navi Mumbai</option>
                      <option>Lower Parel</option>
                      <option>BKC / Andheri</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="fg">
                  <label className="fl">Anything we should know? (optional)</label>
                  <input
                    className="fi"
                    type="text"
                    placeholder="e.g. Using 3 cab vendors, want API access"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="submit">
                  Request Demo →
                </button>
                <div className="form-note">No spam. Just a walkthrough.</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d0630] border-t border-[#8bbeb2]/10 px-8 py-10 flex items-center justify-between flex-wrap gap-4 text-xs text-[#8bbeb2]/50 mt-12">
        <div
          className="font-serif text-lg font-black italic text-[#e6f9af] flex items-center gap-1 cursor-pointer"
          onClick={() => onNavigate && onNavigate('home')}
        >
          Night<span className="text-[#8bbeb2]">Path</span>
          <small className="font-sans not-italic text-[10px] font-semibold uppercase tracking-widest text-[#8bbeb2] ml-2 px-2 py-0.5 border border-[#8bbeb2]/30 rounded-full">
            Business
          </small>
        </div>
        <ul className="flex items-center gap-6 list-none font-medium text-xs">
          <li>
            <button
              onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
              className="text-[#8bbeb2]/70 hover:text-[#e6f9af] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Consumer App
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate && onNavigate('howItWorks')}
              className="text-[#8bbeb2]/70 hover:text-[#e6f9af] uppercase tracking-wider transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate && onNavigate('tourist')}
              className="text-[#8bbeb2]/70 hover:text-[#e6f9af] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Tourist Mode
            </button>
          </li>
          <li>
            <a href="#demo" className="text-[#8bbeb2]/70 hover:text-[#e6f9af] uppercase tracking-wider transition-colors">
              Book a Demo
            </a>
          </li>
        </ul>
        <p className="text-[#8bbeb2]/30 text-[11px]">© 2025 NightPath · Mumbai Safe Night Transport</p>
      </footer>

      {/* TOAST NOTIFICATION */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toast">
        ✓ Request received — we&apos;ll be in touch within a day.
      </div>
    </div>
  );
}
