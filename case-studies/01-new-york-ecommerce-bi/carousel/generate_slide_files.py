import os
import subprocess
from PIL import Image

BASE_DIR = r"c:\Users\G988557\Documents\Code\antigravity\linkedln\case-studies\01-new-york-ecommerce-bi\carousel"
SRC_DIR = os.path.join(BASE_DIR, "src")
EXPORTS_DIR = os.path.join(BASE_DIR, "exports")

os.makedirs(SRC_DIR, exist_ok=True)
os.makedirs(EXPORTS_DIR, exist_ok=True)

# Shared CSS styles
COMMON_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    html, body {
      width: 1080px;
      height: 1350px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #010A17;
      color: #FFFFFF;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .slide-canvas {
      width: 1080px;
      height: 1350px;
      background: #010A17;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 96px 88px;
      position: relative;
      overflow: hidden;
    }
    .slide-canvas::before {
      content: '';
      position: absolute;
      top: -160px;
      right: -160px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(0, 117, 201, 0.16) 0%, rgba(1, 10, 23, 0) 70%);
      pointer-events: none;
    }
    .slide-canvas::after {
      content: '';
      position: absolute;
      bottom: -160px;
      left: -160px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(0, 163, 224, 0.09) 0%, rgba(1, 10, 23, 0) 70%);
      pointer-events: none;
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .eyebrow-tag {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #00A3E0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .eyebrow-tag::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00A3E0;
    }
    .slide-num-pill {
      font-size: 16px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.04em;
    }
    .slide-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 10;
      gap: 32px;
    }
    .hero-metric {
      font-size: 104px;
      font-weight: 900;
      line-height: 1.0;
      letter-spacing: -0.04em;
      color: #FFFFFF;
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .hero-metric.highlight-cyan { color: #00A3E0; }
    .hero-metric.highlight-emerald { color: #10B981; }
    .metric-unit {
      font-size: 38px;
      font-weight: 600;
      color: #94A3B8;
      letter-spacing: -0.01em;
    }
    .metric-caption {
      font-size: 28px;
      font-weight: 600;
      color: #CBD5E1;
      margin-top: -10px;
      line-height: 1.35;
    }
    .slide-headline {
      font-size: 56px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #FFFFFF;
    }
    .slide-headline span.accent { color: #00A3E0; }
    .slide-subheadline {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.45;
      color: #94A3B8;
      max-width: 860px;
    }
    .bullet-cards-stack {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin-top: 10px;
    }
    .bullet-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 24px 30px;
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .bullet-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(0, 117, 201, 0.2);
      border: 1px solid rgba(0, 117, 201, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #00A3E0;
      font-weight: 700;
      font-size: 18px;
    }
    .bullet-text {
      font-size: 26px;
      font-weight: 600;
      color: #E2E8F0;
      line-height: 1.35;
    }
    .bullet-text small {
      display: block;
      font-size: 20px;
      font-weight: 400;
      color: #94A3B8;
      margin-top: 4px;
    }
    .dual-cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 8px;
    }
    .comparison-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .comparison-card.highlight {
      background: rgba(0, 117, 201, 0.08);
      border-color: rgba(0, 163, 224, 0.4);
    }
    .comp-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #94A3B8;
    }
    .comp-title.accent { color: #00A3E0; }
    .comp-price {
      font-size: 46px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }
    .comp-price.accent { color: #10B981; }
    .comp-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 8px;
    }
    .comp-list li {
      font-size: 20px;
      color: #CBD5E1;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .comp-list li::before {
      content: '•';
      color: #64748B;
      font-size: 24px;
    }
    .comp-list.accent li::before {
      content: '✓';
      color: #10B981;
      font-size: 18px;
      font-weight: 800;
    }
    .arch-flow-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .arch-step-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 22px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .arch-step-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .arch-num {
      font-size: 16px;
      font-weight: 800;
      color: #00A3E0;
      background: rgba(0, 163, 224, 0.15);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .arch-title {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .arch-tech {
      font-size: 18px;
      color: #94A3B8;
      font-weight: 500;
    }
    .arch-badge {
      font-size: 16px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      color: #CBD5E1;
    }
    .arch-badge.highlight {
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 10;
    }
    .footer-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .footer-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }
    .footer-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .footer-name {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }
    .footer-brand {
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
    }
    .swipe-pill {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #00A3E0;
      background: rgba(0, 163, 224, 0.12);
      padding: 8px 18px;
      border-radius: 999px;
      border: 1px solid rgba(0, 163, 224, 0.25);
    }
  </style>
</head>
<body>
<div class="slide-canvas">
"""

COMMON_TAIL = """
</div>
</body>
</html>
"""

# 11 Slide bodies
SLIDES = [
    # Slide 1: Cover
    """
    <div class="slide-header">
      <span class="eyebrow-tag">Executive Case Study</span>
      <span class="slide-num-pill">01 / 11</span>
    </div>
    <div class="slide-body">
      <h1 class="slide-headline">
        The <span class="accent">$210,000</span><br>BI Trap.
      </h1>
      <p class="slide-subheadline">
        How a $7M New York brand got enterprise reporting without sacrificing 30% of their net profit.
      </p>
      <div class="bullet-card" style="margin-top: 20px;">
        <div class="bullet-icon">✓</div>
        <div class="bullet-text">
          5-Day Deployment • $0 Software Licenses
          <small>Zero Snowflake compute. Zero Power BI viewer taxes.</small>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-author">
        <img src="../profile_picture.png" alt="Charlton Smith" class="footer-avatar">
        <div class="footer-meta">
          <span class="footer-name">Charlton Smith</span>
          <span class="footer-brand">Appleify Automation</span>
        </div>
      </div>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 2: The Quote
    """
    <div class="slide-header">
      <span class="eyebrow-tag">01 / The Vendor Quote</span>
      <span class="slide-num-pill">02 / 11</span>
    </div>
    <div class="slide-body">
      <div class="hero-metric highlight-cyan">
        $210,000<span class="metric-unit">/ year</span>
      </div>
      <p class="metric-caption">
        Quoted for Snowflake, dbt Cloud, Fivetran & Power BI.
      </p>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">$</div>
          <div class="bullet-text">
            Store Revenue: $7,000,000
            <small>Healthy top-line sales across Shopify and Amazon.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">!</div>
          <div class="bullet-text">
            Net Profit: $600k – $750k
            <small>The proposed SaaS stack would have consumed 30% of their annual profit.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 3: The Dilemma
    """
    <div class="slide-header">
      <span class="eyebrow-tag">02 / The Dilemma</span>
      <span class="slide-num-pill">03 / 11</span>
    </div>
    <div class="slide-body">
      <h2 class="slide-headline">
        Blind on Margins.<br>Trapped by Costs.
      </h2>
      <div class="dual-cards-row">
        <div class="comparison-card">
          <span class="comp-title">The Operational Need</span>
          <p style="font-size: 22px; font-weight: 600; line-height: 1.4;">
            Board presentation in 5 days.
          </p>
          <ul class="comp-list">
            <li>Running on raw CSV exports</li>
            <li>No single view of gross margin</li>
            <li>Unable to track multi-channel ROI</li>
          </ul>
        </div>
        <div class="comparison-card">
          <span class="comp-title">The Enterprise Pitch</span>
          <p style="font-size: 22px; font-weight: 600; line-height: 1.4; color: #EF4444;">
            6-Month Implementation
          </p>
          <ul class="comp-list">
            <li>$210,000/yr recurring SaaS</li>
            <li>$160k/yr engineer required</li>
            <li>Heavy vendor lock-in</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 4: Blueprint
    """
    <div class="slide-header">
      <span class="eyebrow-tag">03 / The Blueprint</span>
      <span class="slide-num-pill">04 / 11</span>
    </div>
    <div class="slide-body">
      <h2 class="slide-headline" style="font-size: 48px;">
        The 5-Day Open Lakehouse.
      </h2>
      <p class="slide-subheadline" style="font-size: 24px;">
        Enterprise performance running directly on open file standards.
      </p>
      <div class="arch-flow-stack">
        <div class="arch-step-card">
          <div class="arch-step-info">
            <div class="arch-num">1</div>
            <div>
              <div class="arch-title">Storage</div>
              <div class="arch-tech">Google Cloud Storage (Parquet)</div>
            </div>
          </div>
          <span class="arch-badge highlight">$4.80 / mo</span>
        </div>
        <div class="arch-step-card">
          <div class="arch-step-info">
            <div class="arch-num">2</div>
            <div>
              <div class="arch-title">Compute</div>
              <div class="arch-tech">Embedded DuckDB (Vectorized SQL)</div>
            </div>
          </div>
          <span class="arch-badge highlight">In-Memory</span>
        </div>
        <div class="arch-step-card">
          <div class="arch-step-info">
            <div class="arch-num">3</div>
            <div>
              <div class="arch-title">Semantics</div>
              <div class="arch-tech">Cube.js Metric Governance</div>
            </div>
          </div>
          <span class="arch-badge highlight">Pre-Aggregated</span>
        </div>
        <div class="arch-step-card">
          <div class="arch-step-info">
            <div class="arch-num">4</div>
            <div>
              <div class="arch-title">Executive UI</div>
              <div class="arch-tech">Metabase OSS Dashboard</div>
            </div>
          </div>
          <span class="arch-badge highlight">$0 Licenses</span>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 5: Storage
    """
    <div class="slide-header">
      <span class="eyebrow-tag">04 / Layer 1: Storage</span>
      <span class="slide-num-pill">05 / 11</span>
    </div>
    <div class="slide-body">
      <div class="hero-metric highlight-cyan">
        $4.80<span class="metric-unit">/ month</span>
      </div>
      <p class="metric-caption">
        Storage cost for 30 million order transactions.
      </p>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">📦</div>
          <div class="bullet-text">
            Apache Parquet Format
            <small>Columnar compression reduces raw CSV storage by 10×.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">⚡</div>
          <div class="bullet-text">
            Zero Idle Compute
            <small>No warehouse instances running 24/7. You only pay for stored bytes.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 6: Compute
    """
    <div class="slide-header">
      <span class="eyebrow-tag">05 / Layer 2: Compute</span>
      <span class="slide-num-pill">06 / 11</span>
    </div>
    <div class="slide-body">
      <div class="hero-metric highlight-cyan">
        1.11<span class="metric-unit">seconds</span>
      </div>
      <p class="metric-caption">
        Direct vectorized scan across multi-year order history.
      </p>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">🚀</div>
          <div class="bullet-text">
            DuckDB Vectorized Engine
            <small>Processes analytical queries in-memory using HTTP range requests.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">🛠</div>
          <div class="bullet-text">
            Zero Cluster Maintenance
            <small>Serverless SQL engine with zero database clusters to patch or tune.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 7: Governance
    """
    <div class="slide-header">
      <span class="eyebrow-tag">06 / Layer 3: Governance</span>
      <span class="slide-num-pill">07 / 11</span>
    </div>
    <div class="slide-body">
      <div class="hero-metric highlight-cyan">
        48<span class="metric-unit">ms</span>
      </div>
      <p class="metric-caption">
        Sub-second executive dashboard response time.
      </p>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">📐</div>
          <div class="bullet-text">
            KPIs Defined Once in Code
            <small>Gross profit, GMV, and AOV governed centrally via Cube.js.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">⚡</div>
          <div class="bullet-text">
            Automated Pre-Aggregations
            <small>Common rollups cached automatically for instantaneous filter changes.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 8: Live Dashboard Screenshot (Requested by User)
    """
    <div class="slide-header">
      <span class="eyebrow-tag">07 / Executive Dashboard</span>
      <span class="slide-num-pill">08 / 11</span>
    </div>
    <div class="slide-body" style="gap: 22px;">
      <h2 class="slide-headline" style="font-size: 46px;">
        The Executive Command Center.
      </h2>
      <p class="slide-subheadline" style="font-size: 22px; margin-top: -12px;">
        Live multi-channel visibility across Shopify, Amazon, and Wholesale.
      </p>
      <div style="position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0, 163, 224, 0.35); box-shadow: 0 20px 50px rgba(0,0,0,0.8); background: #070D18;">
        <img src="../executive_hero_view.png" alt="Executive Dashboard" style="width: 100%; display: block; border-radius: 14px;">
      </div>
      <div style="display: flex; gap: 16px; justify-content: center; margin-top: 4px;">
        <div class="bullet-card" style="padding: 14px 20px; flex: 1; justify-content: center;">
          <span style="font-size: 18px; font-weight: 700; color: #00A3E0;">⚡ 1.11s Scan Time</span>
        </div>
        <div class="bullet-card" style="padding: 14px 20px; flex: 1; justify-content: center;">
          <span style="font-size: 18px; font-weight: 700; color: #10B981;">✓ 100% Client Data Privacy</span>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 9: Interface
    """
    <div class="slide-header">
      <span class="eyebrow-tag">08 / Layer 4: Interface</span>
      <span class="slide-num-pill">09 / 11</span>
    </div>
    <div class="slide-body">
      <div class="hero-metric highlight-emerald">
        Unlimited<span class="metric-unit">Users</span>
      </div>
      <p class="metric-caption">
        Zero per-seat software licensing fees.
      </p>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">📊</div>
          <div class="bullet-text">
            Clean Executive Interface
            <small>Real-time channel breakdown, gross margins, and SKU performance.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">🔒</div>
          <div class="bullet-text">
            Built-in Privacy & Security
            <small>Customer PII masked dynamically before rendering.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 10: Cost comparison
    """
    <div class="slide-header">
      <span class="eyebrow-tag">09 / Cost Comparison</span>
      <span class="slide-num-pill">10 / 11</span>
    </div>
    <div class="slide-body">
      <h2 class="slide-headline" style="font-size: 46px;">
        The Financial Difference.
      </h2>
      <div class="dual-cards-row">
        <div class="comparison-card">
          <span class="comp-title">Enterprise Proposal</span>
          <div class="comp-price" style="color: #EF4444;">$210,000<span style="font-size: 20px; font-weight: 500; color: #94A3B8;">/yr</span></div>
          <ul class="comp-list">
            <li>Snowflake + dbt + Fivetran</li>
            <li>$160k Data Engineer</li>
            <li>6-Month Rollout</li>
            <li>Per-Seat Viewer Fees</li>
          </ul>
        </div>
        <div class="comparison-card highlight">
          <span class="comp-title accent">Open Lakehouse</span>
          <div class="comp-price accent">$0<span style="font-size: 20px; font-weight: 500; color: #94A3B8;"> licenses</span></div>
          <ul class="comp-list accent">
            <li>GCS + DuckDB + Cube</li>
            <li>Existing 2-Person Team</li>
            <li>5-Day Delivery</li>
            <li>Unlimited Viewers</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span class="footer-brand">Appleify Automation</span>
      <span class="swipe-pill">Swipe →</span>
    </div>
    """,

    # Slide 11: Takeaways
    """
    <div class="slide-header">
      <span class="eyebrow-tag">10 / Key Takeaways</span>
      <span class="slide-num-pill">11 / 11</span>
    </div>
    <div class="slide-body">
      <h2 class="slide-headline" style="font-size: 52px;">
        Three Rules for Modern BI.
      </h2>
      <div class="bullet-cards-stack">
        <div class="bullet-card">
          <div class="bullet-icon">1</div>
          <div class="bullet-text">
            Clarity Over Complexity
            <small>You do not need six-figure SaaS contracts to understand your margins.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">2</div>
          <div class="bullet-text">
            Own Your Infrastructure
            <small>Open file formats on cloud storage eliminate expensive vendor lock-in.</small>
          </div>
        </div>
        <div class="bullet-card">
          <div class="bullet-icon">3</div>
          <div class="bullet-text">
            Upskill, Don't Bloat
            <small>Your existing technical team can run modern open-source data systems.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <div class="footer-author">
        <img src="../profile_picture.png" alt="Charlton Smith" class="footer-avatar">
        <div class="footer-meta">
          <span class="footer-name">Charlton Smith</span>
          <span class="footer-brand">Appleify Automation</span>
        </div>
      </div>
      <span class="swipe-pill">End • Summary</span>
    </div>
    """
]

# Write individual slide HTML files
for i, content in enumerate(SLIDES, start=1):
    file_path = os.path.join(SRC_DIR, f"slide_{i}.html")
    full_html = COMMON_HEAD + content + COMMON_TAIL
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"Created {file_path}")

print("All 11 slide HTML files created successfully.")
