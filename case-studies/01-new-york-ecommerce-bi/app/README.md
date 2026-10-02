# Appleify Automation | E-Commerce Intelligence Portal ($1,000 BI Stack)

A high-performance executive analytics web application replicating the **Metabase OSS Command Center** and backed by the **$1,000 BI Stack** (DuckDB + Cube.js + Google Cloud Storage Parquet).

---

## 1. Brand Identity & Design System
- **Company**: Appleify Automation Ltd.
- **Palette**:
  - Midnight Navy: `#010A17`
  - Vibrant Cobalt: `#0075C9`
  - Electric Sky Cyan: `#00A3E0`
  - Accent Green: `#00C48C`
  - Surface Neutral: `#FFFFFF` / Slate `#F8FAFC`
- **Typography**: Inter & Outfit (Google Fonts)

---

## 2. Mathematical Scaling & Data Transformation
Per company specification, raw lakehouse metrics (derived from 29.2M transaction partitions) are scaled to realistic mid-market e-commerce operations:

| Metric | Raw Lakehouse Value | Transformation Applied | Scaled Portal Value |
| :--- | :--- | :--- | :--- |
| **Gross Merchandise Value (GMV)** | R 7,429,512,209.198 | **Divided by 1,000** | **R 7,429,512.21** (~$7.4M) |
| **Total Orders Processed** | 29,209,326 | **Divided by 100** | **292,093 Orders** |
| **Unique Active Customers** | 1,473,801 | **Divided by 100** | **14,738 Customers** |
| **Average Order Value (AOV)** | Calculated | `GMV / Orders` | **R 254.35** |
| **Checkout Abandoned Cart Value** | R 7,221,142,235.38 | **Divided by 1,000** | **R 7,221,142.24** |
| **Funnel Abandoned Sessions** | 129,954 | **Divided by 100** | **1,299 Sessions** |

---

## 3. Cosmetic Industry Domain Mapping
- **Categories**:
  - *Skincare & Active Serums* (42% GMV share)
  - *Color Cosmetics & Lip Care* (26% GMV share)
  - *Hair Care & Scalp Treatments* (16% GMV share)
  - *Fragrance & Clean Perfumery* (10% GMV share)
  - *Bath, Body & SPF Sun Care* (6% GMV share)
- **Multi-Channel Distribution**:
  - *Shopify Direct-to-Consumer (DTC)*: 80% (233,674 orders)
  - *Amazon Premium Beauty (FBA)*: 15% (43,814 orders)
  - *Wholesale Specialty Boutiques (B2B)*: 5% (14,605 orders)

---

## 4. How to Run Locally

```bash
# Run with Python 3
python3 server.py

# Access via browser
http://localhost:8085
```
