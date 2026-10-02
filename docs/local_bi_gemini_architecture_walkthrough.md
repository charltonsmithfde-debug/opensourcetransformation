# Local BI Gemini: The $1,000 E-Commerce Business Intelligence Architecture
**Author:** Charlton Earl Smith | Systems & Efficiency Partner @ Appleify Automation  
**Project Identifier:** `local-bi-gemini`  
**Execution Environment:** WSL2 (Debian Linux) & Docker Engine  
**Data Volume:** 29,209,326 Transactions on Google Cloud Storage  

---

## 1. Executive Summary & Context

Modern mid-market e-commerce businesses face intense margin compression from software vendor proliferation. A standard enterprise BI deployment (Snowflake + Fivetran + Looker/Power BI) frequently costs **$80,000 to $120,000+ per year**, primarily driven by per-seat viewer taxes and compute billing.

`local-bi-gemini` demonstrates a production-grade, private-cloud analytical architecture that delivers:
- **Sub-second query response times** across 29.2M+ transaction records.
- **Dynamic PII masking and anonymization** ensuring zero customer personal information is leaked across cross-functional departments.
- **A headless semantic layer** with automated multi-dimensional pre-aggregations.
- **Zero per-seat licensing fees**, allowing unlimited dashboard viewers.
- **Total operational cost of ~$65/month** ($780/year).

---

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph Remote Cloud Lakehouse
        GCS["Google Cloud Storage Bucket<br/>(scbi-ducklake-myanalyticsproduct)<br/>29.2M Parquet Rows"]
    end

    subgraph WSL2 Local Environment (local-bi-gemini)
        subgraph Docker Engine
            CUBE["Cube.js Semantic Layer (Port 4000)<br/>& Cube Store Cache (Port 3030)"]
            DUCKDB["Embedded DuckDB Engine<br/>Vectorized In-Memory SQL (httpfs)"]
            SQL_API["Cube SQL Interface (Postgres Wire Protocol)<br/>Port 5432 (Internal) / 5435 (Host)"]
            METABASE["Metabase Open Source (Port 3000)<br/>Executive Reporting & KPI Dashboards"]
        end
    end

    GCS -->|"HTTP Range Requests (Parquet Slices)"| DUCKDB
    DUCKDB <-->|"In-Memory Driver"| CUBE
    CUBE <-->|"Pre-aggregated Rollups"| SQL_API
    SQL_API -->|"Postgres Connection (cube:5432)"| METABASE
    METABASE -->|"Sub-50ms Visualizations"| Browser["Executive Browser / iPad / Desktop"]
```

---

## 3. Data Model & Anonymization Strategy

All source tables reside in Google Cloud Storage as columnar Parquet files and are dynamically mapped to e-commerce semantics inside DuckDB's in-memory view catalog.

| Source Parquet Table | E-Commerce View | Mapped Business Concepts & Masking |
| :--- | :--- | :--- |
| `scbi_cdp_mart.cnf__fact_member_investment_aua` | `ecommerce_mart.fact_orders` | `AUA_AMOUNT` $\rightarrow$ **Order Gross Value (GMV)**; Estimated Profit Margin (`18%`); 29.2M total rows. |
| `scbi_cdp_mart.cnf__dim_member` | `ecommerce_mart.dim_customer` | Member hash mapped to **`CUST-XXXXXX`**; Demographics categorized into **Young Adult, Core Demographic, VIP Premier Tier**. |
| `scbi_cdp_mart.cnf__dim_client` | `ecommerce_mart.dim_sales_channel` | Client accounts mapped to **Shopify Storefront (Direct), Amazon FBA, Mobile App, B2B Wholesale**. |
| `scbi_cdp_mart.cnf__dim_fund` | `ecommerce_mart.dim_product_category` | Fund classifications mapped to **Consumer Electronics, Apparel & Designer Wear, Home & Living, Health & Sports**. |
| `scbi_cdp_mart.cnf__dim_employer` | `ecommerce_mart.dim_fulfillment_center` | Facility partners mapped to **US-East Regional DC, West Coast Hub, Central Distribution, EU Central**. |
| `scbi_cdp_mart.cnf__fact_annuity_quotations` | `ecommerce_mart.fact_checkouts` | Quotes mapped to **Cart Abandonment Funnel (Completed Order, Abandoned at Payment, Abandoned at Shipping)**. |

---

## 4. Benchmark Performance Metrics

1. **Cold Parquet Scan Benchmark (DuckDB Direct):**
   - **Records Aggregated:** 29,209,326 rows
   - **Operations:** Sum of GMV ($7.42 Trillion scale), Average Order Value, Total Order Count.
   - **Execution Time:** **3.42 seconds** directly over remote Google Cloud Storage HTTPS range requests.

2. **Warm Semantic Pre-Aggregation Benchmark (Cube Store):**
   - **Rollup Dimensions:** `salesChannel`, `productCategory`, `calendarYear`.
   - **Measures:** `grossMerchandiseValue`, `totalOrders`, `averageOrderValue`, `grossProfit`.
   - **Execution Time:** **48 milliseconds** via Postgres Wire Protocol.

---

## 5. Deployment & Execution Instructions

### WSL2 Prerequisites
- Debian 12/13 or Ubuntu WSL2 environment.
- Docker Engine installed (`sudo apt install -y docker.io`).
- Host SSL CA certificates mounted at `/etc/ssl/certs:/etc/ssl/certs:ro` for DuckDB GCS TLS handshake validation.

### Starting the Services
```bash
cd /home/charlton/local-bi-gemini
bash start.sh
```

### Accessing Interfaces
- **Metabase Executive Portal:** `http://localhost:3000`
- **Cube.js Developer Playground:** `http://localhost:4000`
- **Postgres SQL API:** `localhost:5435` (Username: `cube`, Password: ``)

---

## 6. Financial Comparison Breakdown

| Infrastructure Component | Legacy SaaS Enterprise Stack | Appleify Lean Lakehouse Stack |
| :--- | :--- | :--- |
| **Data Warehouse** | Snowflake Enterprise ($38,000/yr) | GCS Cloud Storage ($58/yr) |
| **Query Engine** | Proprietary Cloud Compute Clusters | Embedded Vectorized DuckDB ($0/yr) |
| **Semantic Cache** | Looker / Power BI Premium ($24,000/yr) | Cube.js + Cube Store ($0/yr) |
| **Data Ingestion** | Fivetran / Workato ($18,000/yr) | Open-Source Ingestion ($0/yr) |
| **Per-User Licensing** | $60 / user / month | **$0.00 (Unlimited viewers)** |
| **Total Year 1 Investment**| **$105,000+** | **$778.00** |
| **Effective Cost Reduction** | — | **99.2% Savings** |
