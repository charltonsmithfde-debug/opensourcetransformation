# Carousel 02: How We Built a $100K Enterprise BI Stack for Under $1,000
**Format:** 10-Slide Visual Document (1080x1350 Portrait Carousel)  
**Palette:** Appleify Obsidian (`#010A17`), Royal Blue (`#0075C9`), Cyan Highlight (`#00A3E0`), Crisp White (`#FFFFFF`), Slate Gray (`#94A3B8`)  
**Typography:** Inter / SF Pro Display (High contrast, tight tracking, editorial layout)  

---

### Slide 1: The Hook (Cover)
* **Eyebrow:** Systems & Efficiency Case Study
* **Main Title:** How We Built a $100,000 Enterprise BI System for an E-Commerce Brand...
* **Highlight Banner (Cyan / Royal Blue):** ...for Under $1,000.
* **Subtitle:** Zero Snowflake compute. Zero Power BI viewer taxes. Real-time dashboards on 29.2M rows.
* **Footer:** Charlton Earl Smith • Systems & Efficiency Partner @ Appleify Automation

---

### Slide 2: The Bottleneck
* **Tag:** The Problem
* **Headline:** The $80,000 SaaS Trap
* **Narrative:**
  A rapidly growing multi-channel e-commerce business was losing 18+ hours every week reconciling sales between Shopify, Amazon, and ERP spreadsheets.
* **The Enterprise Vendor Proposal:**
  - Snowflake Data Warehouse: $38,000 / yr
  - Power BI / Looker Seat Licenses: $24,000 / yr
  - Fivetran ETL Pipeline: $18,000 / yr
  - Agency Implementation: $25,000
* **The Executive Dilemma:** *"We need data to make decisions, but our board won't approve $100K in software overhead."*

---

### Slide 3: The Philosophy
* **Tag:** The Approach
* **Headline:** Stop Paying "Seat Taxes" on Your Own Data
* **Core Principle:**
  Your customers pay you for exceptional products and reliable fulfillment. They don't pay you to maintain 14 disconnected SaaS subscriptions.
* **The 48-Hour Challenge:**
  Can we build a production BI platform that delivers instant insights, complete data ownership, and sub-second query performance—with zero per-seat software licensing?

---

### Slide 4: The 4-Layer Architecture
* **Tag:** System Blueprint
* **Headline:** The Lean Lakehouse Architecture
* **Diagram Flow:**
  1. **Storage Layer:** Google Cloud Storage (Columnar Parquet Lakehouse)
     - Cost: $4.80/month for 30M rows.
  2. **Vector Engine:** Embedded DuckDB
     - Executes vectorized SQL directly against cloud Parquet in RAM.
  3. **Headless Semantic Layer:** Cube.js + Cube Store
     - Standardized business KPIs + pre-aggregated cache.
  4. **Executive UI:** Metabase Open Source
     - Zero-cost dashboards on desktop, tablet, and mobile.

---

### Slide 5: Layer 1 — Columnar Parquet Storage
* **Tag:** Storage & Ingestion
* **Headline:** Eliminating the $3,000/mo Data Warehouse
* **Key Insights:**
  - Transactional orders are partitioned by date into open-format Apache Parquet files on Google Cloud Storage.
  - 10x compression: 30GB of raw CSVs shrinks to 2.4GB.
  - Zero compute running while idle. You only pay for object storage.
* **Monthly Cost:** **~$4.80** (vs $3,200/mo Snowflake minimum).

---

### Slide 6: Layer 2 — Vectorized Compute (DuckDB)
* **Tag:** Processing Engine
* **Headline:** 29.2 Million Rows Scanned in 3.4 Seconds
* **Why DuckDB?**
  - DuckDB's vectorized query engine processes millions of rows per CPU core.
  - Built-in `httpfs` extension streams GCS Parquet partitions directly over HTTP range requests.
  - No database server to maintain, patch, or scale.
* **Benchmark:** Single DuckDB query aggregated 29,209,326 transactions, calculated total GMV ($7.4B) and Average Order Value in **3.42 seconds**.

---

### Slide 7: Layer 3 — Cube.js Headless Semantic Layer
* **Tag:** Logic & Governance
* **Headline:** Business Metrics Defined Once in Code
* **The Magic of Pre-Aggregations:**
  - Raw scans of 29M rows take 3 seconds.
  - Cube’s automated pre-aggregation engine pre-calculates rollups (by Date, Sales Channel, and Product Category) into Cube Store.
  - When the CEO opens the dashboard or filters by Channel, the query returns in **48 milliseconds**.
* **Zero SQL Required:** Business users never write raw queries. The metric definitions are governed centrally.

---

### Slide 8: Layer 4 — Metabase Executive Interface
* **Tag:** Front-End Experience
* **Headline:** Executive Dashboards With Zero Per-Seat Taxes
* **What the Leadership Team Sees Every Morning:**
  - Live Daily GMV & Gross Profit Margins across Shopify, Amazon, and Wholesale.
  - Cart Abandonment & Checkout Funnel drop-offs.
  - Customer Cohort Repeat Purchase Rates (with PII dynamically masked).
* **User Cap:** Unlimited viewers. Adding 50 managers costs **$0.00**.

---

### Slide 9: The Financial Reality Check
* **Tag:** The ROI Comparison
* **Headline:** $105,000 vs $850 per Year

| Feature | Legacy Enterprise Stack | Appleify Lean Lakehouse |
| :--- | :--- | :--- |
| **Data Warehouse** | Snowflake ($38,000/yr) | GCS Parquet ($58/yr) |
| **Semantic / Cache** | Looker / Power BI ($24,000/yr) | Cube.js + DuckDB ($0/yr) |
| **Pipeline & Ingest** | Fivetran ($18,000/yr) | Open-Source Ingest ($0/yr) |
| **Compute Hosting** | Proprietary Cloud | Local / Cloud Run ($720/yr) |
| **Per-Seat License** | $60 / user / month | **$0.00 (Unlimited)** |
| **Total Year 1 Cost** | **$105,000+** | **$778.00** |

* **Time-to-Value:** 48 hours vs 6 months implementation.

---

### Slide 10: Conclusion & Next Step
* **Tag:** Summary
* **Headline:** Stop Funding Software Bloat. Build Background Systems.
* **Takeaways:**
  1. Your business doesn't need more SaaS bills—it needs streamlined workflows.
  2. Open-source infrastructure on your private cloud delivers enterprise power at consumer prices.
  3. Keep your margins where they belong: in your business.
* **Call to Action:**
  Want to diagnose where your operations are leaking time and revenue?
  Request your **48-Hour Operational Audit** at **appleifyautomation.com** or send me a DM.
* **Sign-off:** Charlton Earl Smith • Systems & Efficiency Partner

