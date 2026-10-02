# BI Platform Cost Analysis: Snowflake Stack vs Open-Source Lakehouse Stack

Compiled: 2 October 2026

This file contains two cost analyses, with the prompts that produced them, so they can be reused as research input.

- **Part 1:** Snowflake + dbt Cloud + Fabric/Power BI (commercial SaaS stack)
- **Part 2:** GCS/Parquet + DuckLake + Cube.js (embedded DuckDB) + Metabase (open-source stack, POC then managed service)
- **Part 3:** Side-by-side comparison and caveats

**Method note.** Part 1 uses list prices from memory and was not checked against live vendor pages. In Part 2, only Metabase pricing was checked against web sources (see Sources). GCP figures are from memory of list prices (us-central1/us-east4). Verify all figures against vendor quotes or the GCP pricing calculator before relying on them.

---

## Prompts

### Prompt 1: Snowflake stack cost estimate

> As a Cost Estimator for SaaS, estimate the annual cost in dollars for a company deploying 10 to 50 terabytes of source data to snowflake, then running 300+ dbt cloud jobs to convert the sources into BI star schemas in a stage, intermediate, mart and product, semantic model design. These connect to PowerBI through fabric to service 100 to 200 end consumers. We run a dev, PPE and Prod warehouse. Dev and PPE is defaulted to the smallest instance and bursts into the next size level when we need to run full refreshes which is every 2nd week. The resulting product and mart models are about 800GB on snowflake
>
> The technical team requiring licences etc and claude code pro licences are
>
> Development: 8 developers / data engineers
> Analytics and Analysis: 6 Analysts (all creating powerbi reports too)
> 2 Managers
> 1 Scrum Master
>
> I want an estimate of the costs to run and maintain this
>
> 1. SAAS Annual Costs
> 2. Technical Team Annual Licences
> 3. Team Annual Salaries
>
> Estimates and rationale please (in dollars, assume this is in the USA, New York)

### Prompt 2: Open-source alternative (with the architecture document attached)

> Now write a similar analysis for the alternative
>
> "You are a Consultant of a large e-commerce store and you are in desperate need for business intelligence with no budget for any SaaS Products but you must prove the solution to the executives before they give you the contract by virtue of a demonstration as to how it be beneficial t the business.... all your data sits in various other products and databases.
> You have settled on a data pipeline to parquet files to google cloud storage, a cube.js server with an embedded duckdb analytical engine and a ducklake to handle the management of the parquet file delivery and pipeline and a metabase front end to deliver reports"
>
> Attached is the architecture we following. We are adding metabase too
>
> Technical staff costs is naught. As the existing two staff members in the company is going to be upskilled.
>
> Open Source Tech Stack
>
> Should the POC be filled, my comany will take control of the stack, the build the maintenance at a price per month, less than what a single data engineer will cost them

**Attachment summary (`version-two-clarify.md`).** The architecture is:

- Parquet files in Google Cloud Storage, with a DuckLake catalog in Cloud SQL (PostgreSQL) providing ACID snapshots.
- DuckDB embedded in-process inside Cube.js. There is no separate DuckDB server.
- Cube.js as the single semantic/metric layer, handling RBAC and POPIA PII masking.
- Two Cube deployments from the same image: REST/GraphQL on Cloud Run (port 4000) for the thin web portal, and the SQL API (Postgres wire, port 5432) on a Compute Engine VM for Metabase and Power BI via an IAP tunnel.
- Local dev needs only a Postgres container, Cube.js, and the web app, with Parquet read directly from GCS.

### Prompt 3: This file

> create a markdown file with this whole analysis so that I can feed it into my research (include prompts too)

---

# Part 1: Snowflake + dbt Cloud + Fabric/Power BI (New York, USA)

Ranges map to the 10 TB (low) and 50 TB (high) scenarios.

## 1. SaaS annual costs

| Item | Low | Mid | High |
|---|---|---|---|
| Snowflake compute | $60K | $100K | $160K |
| Snowflake storage | $5K | $13K | $23K |
| dbt Cloud (Enterprise) | $50K | $80K | $120K |
| Fabric capacity (Power BI service) | $60K | $80K | $101K |
| Ingestion/orchestration tooling | $20K | $40K | $80K |
| Cloud object storage/network | $5K | $8K | $15K |
| Ancillary (observability, catalog, etc.) | $8K | $12K | $20K |
| **Total** | **~$210K** | **~$335K** | **~$520K** |

### Rationale

**Snowflake compute.** Assumed Enterprise edition on AWS at about $3 per credit on demand, or about $2.40 to $2.60 with a capacity contract.

| Workload | Low | High |
|---|---|---|
| Prod transform (dbt): Medium to Large, 6 to 8 hrs/day, 365 days | ~8.8K credits | ~23K credits |
| Prod ingest/load: Small to Medium | ~2.9K credits | ~8.8K credits |
| BI/Fabric query warehouse: Small to Medium, ~10 hrs/day, business days | ~5K credits | ~10K credits |
| Dev: XS daily, bursting to Small for 26 full refreshes/yr | ~2.2K credits | ~3K credits |
| PPE: XS daily, bursting to Small every 2nd week | ~2.1K credits | ~2.7K credits |
| Serverless features (clustering, tasks, cloud services overage) | +8% | +10% |
| **Total** | **~23K credits** | **~53K credits** |

At $2.60 to $3.00 per credit, that gives about $60K to $160K.

The full refreshes every second week are the biggest swing factor in Dev and PPE. Against 10 to 50 TB of source data, a refresh on a Small can run for many hours. If Dev and PPE refresh the full source volume, expect the high end. Sampled or cloned data for Dev would cut Dev compute substantially.

**Snowflake storage.** About $23 per TB per month on demand, or about $20 with capacity pricing. The base is the Prod source layer plus 0.8 TB of marts and products. I added about 40% for Dev and PPE clones that drift from Prod, plus about 15% for Time Travel and Fail-safe. That gives roughly 16 TB (low) to 75 TB (high) billed, or $5K to $23K per year.

**dbt Cloud.** With 300+ jobs, 8 developers, and a stage/intermediate/mart/product structure, model-build volume will likely exceed the Starter plan's 5 seats and 15K models per month. You would likely need Enterprise, which is custom-priced and usually negotiated at $50K to $120K per year.

**Fabric capacity.** For 100 to 200 consumers I assumed an F64, which lets viewers read content without individual Pro licences. A semantic model fed by 800 GB of marts also needs real capacity. Reserved pricing is roughly $60K per year, and pay-as-you-go is roughly $100K. A cheaper pattern is an F32 with Pro licences for all 200 consumers, which costs similar money but is less scalable.

**Ingestion tooling.** Not specified in the brief. Snowpipe or COPY from cloud storage costs almost nothing extra. A managed connector like Fivetran at 10 to 50 TB can add $40K to $80K or more. I included a middle allowance, which is the largest uncertainty in the table.

## 2. Technical team annual licences (17 people)

| Item | Basis | Low | Recommended |
|---|---|---|---|
| Claude Code | Pro at $20/mo x 17, or Team premium seats for devs and standard seats for the rest | ~$4K | ~$17K |
| Power BI Pro (creators) | 14 builders x $14/mo | $2.4K | $2.4K |
| GitHub | ~$21/user/mo x 17 | $4.3K | $4.3K |
| Jira + Confluence | ~$14/user/mo x 17 | $2.9K | $2.9K |
| Tabular Editor / SQL IDEs | ~8 to 14 seats | $3.4K | $6.6K |
| Microsoft 365 | Likely already provided by the company | $0 | $7.3K |
| **Total** | | **~$17K** | **~$41K** |

Claude Pro is licensed for individual use, and heavy Claude Code users will hit its limits quickly. For a company team, the Team plan with premium seats (about $150/mo per seat) is the safer assumption. Managers and the scrum master can use standard seats.

## 3. Team annual salaries (New York)

| Role | Headcount | Assumed base | Total |
|---|---|---|---|
| Data engineers (1 lead, 3 senior, 3 mid, 1 junior) | 8 | $115K to $210K | ~$1,285K |
| Analysts (2 senior, 3 mid, 1 junior) | 6 | $90K to $135K | ~$690K |
| Managers (data/engineering and analytics) | 2 | $185K to $210K | ~$395K |
| Scrum master | 1 | ~$135K | ~$135K |
| **Base total** | **17** | | **~$2.5M** (range $2.2M to $2.8M) |

Payroll taxes, benefits, and typical bonuses add roughly 28%, so the **fully loaded cost is about $3.2M** (range $2.8M to $3.6M).

## Summary

| Category | Low | Mid | High |
|---|---|---|---|
| SaaS | $210K | $335K | $520K |
| Licences | $17K | $28K | $41K |
| Salaries (fully loaded) | $2.8M | $3.2M | $3.6M |
| **Total** | **~$3.0M** | **~$3.6M** | **~$4.2M** |

People are roughly 85 to 90% of the total. Platform spend is a relatively small, controllable slice.

## Biggest levers to reduce cost

- **Dev/PPE refreshes:** use clones, sampled data, or partial full-refreshes instead of the full source volume.
- **Snowflake:** set auto-suspend to 60 seconds, buy capacity credits, use incremental models, and use resource monitors.
- **Fabric:** reserved capacity cuts roughly 40% off pay-as-you-go. Import mode with scheduled refresh reduces warehouse load from BI queries.
- **dbt Cloud:** negotiate based on build volume, and consider consolidating the 300+ jobs.

**Open question:** the ingestion tool, and whether Dev/PPE refresh the full source data, would tighten the range considerably.

---

# Part 2: Open-Source Lakehouse + Semantic Layer + Metabase (POC then Managed Service)

**Assumptions.** E-commerce marts layer of roughly 100 GB for the POC, growing to 800 GB in production, with 100 to 200 report consumers. Prices are in USD.

## 1. Cloud/infrastructure annual costs

### POC phase (about 90 days)

| Item | Monthly |
|---|---|
| GCS (about 200 GB Parquet) | $5 |
| Cloud SQL Postgres (small, DuckLake catalog) | $40 |
| Cube.js on Cloud Run (REST) | $40 |
| Small VM for Cube SQL API | $30 |
| Metabase on Cloud Run (shared Postgres for its app DB) | $40 |
| Extract/load (a scheduled VM or Cloud Run Jobs) | $60 |
| Networking, logging, secrets | $50 |
| **Monthly** | **~$270** |
| **POC total (3 months)** | **~$0.8K (range $0.5K to $2K)** |

If this is a new GCP billing account, the standard free-trial credit may cover the whole POC, so the demonstration could cost effectively nothing.

### Production run-rate (annual)

| Item | Low | Mid | High |
|---|---|---|---|
| GCS storage (raw landing, marts, versions) | $0.6K | $1.7K | $4K |
| GCS operations and egress | $0.2K | $0.6K | $1.5K |
| Cloud SQL catalog (HA at the high end) | $1.2K | $3K | $6K |
| Cube REST on Cloud Run | $1.5K | $4K | $8K |
| Cube SQL API VM (Power BI/Metabase) | $1K | $2K | $4K |
| Cube Store / pre-aggregation cache | $0.5K | $1.5K | $3K |
| Metabase (Cloud Run plus app DB) | $0.8K | $1.5K | $3K |
| Ingestion/orchestration compute | $2K | $4K | $9K |
| DuckDB reload jobs writing through DuckLake | $1K | $3K | $7K |
| Networking (NAT, VPC, IAP, load balancer) | $0.8K | $1.5K | $3K |
| Logging, monitoring, registry, secrets | $0.5K | $1K | $2.5K |
| Backups and DR (second copy of bucket, catalog backups) | $0.3K | $1K | $3K |
| **Total** | **~$10K** | **~$25K** | **~$54K** |

### Rationale

- **Storage is almost negligible.** Parquet is heavily compressed, and 800 GB of marts costs only about $18 per month at GCS standard rates. The cost drivers are the always-on compute (Cube, the VM, Cloud SQL) and ingestion.
- **Cube.js needs real memory.** DuckDB runs inside the Cube process, so I sized Cloud Run at roughly 4 vCPU and 16 GB with a minimum of one instance. This is the main scaling knob, and scaling is vertical.
- **Dual Cube deployment.** The REST service runs on Cloud Run and the SQL API runs on a VM, because Cloud Run can't carry the Postgres wire protocol. The VM adds only about $1K to $4K per year.
- **Ingestion is the biggest uncertainty.** I assumed open-source extractors on a VM or Cloud Run Jobs. I'd recommend dlt or custom Python over Airbyte OSS, because Airbyte's core licence restricts offering it as a hosted service, which matters if you will manage this for the client. Verify that against the licence text.
- **Source-side costs are excluded.** These are read replicas on the operational databases and any egress charged by the source clouds.

## 2. Technical team licences

| Item | POC | Production |
|---|---|---|
| DuckDB, DuckLake, Cube.js core, PostgreSQL, Docker | $0 | $0 |
| Metabase Open Source (self-hosted) | $0 | $0 |
| Power BI Desktop (optional, via the Cube SQL API) | $0 | $0 |
| Claude Code Pro, 2 seats at $20/mo (optional) | ~$0.5K | ~$0.5K |
| **Total** | **$0 to $0.5K** | **$0 to $0.5K** |

- **Metabase.** The open-source edition is free with unlimited users when self-hosted. It is usually described as AGPL, though one source lists Apache 2.0, so confirm the licence before modifying or embedding it.
- **Upgrade path.** If the client later needs SSO or row-level sandboxing, Cloud Pro is listed at $575/month plus $12 per user beyond the first 10, and Enterprise starts at $20,000/year. At 150 to 200 users, Pro is roughly $27K to $34K per year. Cube already handles RBAC and POPIA PII masking upstream, so this may never be needed.
- **Power BI.** The architecture supports DirectQuery through the Cube SQL API. Publishing to the Power BI service needs per-user licences, so it is excluded from the "no SaaS" scope.

## 3. Team salaries

| Phase | Cash cost |
|---|---|
| POC | **$0** (the two existing staff are upskilled) |
| Production (client takes over) | Replaced by the managed-service fee below |

The cash cost is zero, but executives may ask what the two staff cost in time. At about 50% allocation for three months, that is roughly $40K to $50K of internal time, which is best shown as a footnote.

## 4. Managed-service pricing

The Part 1 estimate puts a data engineer at about $13K to $17K per month fully loaded (an NYC base of roughly $125K to $160K plus about 28% loading). The fee needs to sit clearly below that.

| Tier | Scope | Monthly (infra included) | Annual |
|---|---|---|---|
| Essential | Monitoring, patching, reload SLA, break/fix (~10 hrs) | ~$5.5K | ~$66K |
| Standard | Essential plus new metrics/cubes, RBAC changes, Metabase support (~25 hrs) | ~$8K | ~$96K |
| Premium | Standard plus on-call, DR tests, parity/RBAC test suite upkeep (~50 hrs) | ~$11.5K | ~$138K |

The fees include about $2K per month of pass-through infrastructure, which is the mid case above. Each tier is 15% to 60% below one engineer, and the client gets a team rather than one person. The margin works if each client takes about 0.25 to 0.4 of an engineer's time, so several clients must share tooling, runbooks and the test suite.

## Risks to disclose to executives

- **Concurrency ceiling.** 100 to 200 users on embedded DuckDB depends on Cube pre-aggregations and caching. Scaling is vertical, so test it in the POC with the concurrency smoke test in the architecture plan.
- **DuckLake maturity.** It is a young format, so pin versions and keep the snapshot and recon-parity tests.
- **Key-person risk.** Two upskilled staff is thin. Runbooks and the managed-service tier mitigate it.
- **Metabase OSS limits.** It has basic permissions and no advanced SSO or sandboxing. Cube's role-scoped SQL users compensate for this.
- **Ingestion effort.** Hidden engineering time goes into the ingestion pipelines, which cost the most labour even though they are cheap in cloud spend.

## Pitch summary

| | Cost |
|---|---|
| POC | ~$1K cloud (possibly covered by credits) plus existing staff time |
| Production run | ~$10K to $54K per year, mid ~$25K |
| Managed service | $5.5K to $11.5K per month, below one data engineer |

**Open question:** where the source data lives and how often it must refresh would tighten the ingestion and Cube sizing.

---

# Part 3: Comparison and caveats

| | Snowflake + dbt Cloud + Fabric | Open-source stack |
|---|---|---|
| Platform spend (mid) | ~$335K/yr | ~$25K/yr |
| Licences | ~$28K/yr | ~$0 to $0.5K/yr |
| Cost to prove | Very high | ~$1K |
| Staff | 17 people, ~$3.2M loaded | 2 existing staff, plus a fee of $66K to $138K/yr after handover |

The scopes are not identical. Snowflake handles 10 to 50 TB of source data with elastic compute. The open-source stack assumes marts around 800 GB queried by one embedded DuckDB node per Cube instance.

**Caveats**

- Prices are estimates from list prices and memory, except the Metabase figures, which were checked against web sources.
- Salaries are assumed market ranges for New York, not quotes.
- The architecture document mentions POPIA, a South African regulation. If the deployment is in South Africa, rates, salaries, and data-residency choices (GCP region) will differ from the USD/New York assumptions.
- Licence terms (Airbyte, Metabase AGPL) are from memory and the sources below, and need legal verification.

---

## Sources (Metabase pricing, checked 2 October 2026)

- https://coefficient.io/metabase-pricing (Open Source free; Starter $100/month; Pro $575/month)
- https://www.metabase.com/pricing.md (Starter and Pro self-service; annual saves about 10%)
- https://querio.ai/articles/metabase-pricing-cost (Pro $6,210/year; Enterprise from $20,000/year)
- https://www.costbench.com/software/business-intelligence/metabase/ (Pro $575/month plus $12/user, first 10 included)
- https://mammoth.io/blog/metabase-pricing/ (verified against the Metabase pricing page, 25 September 2026)
- https://www.vendr.com/marketplace/metabase (open-source edition has no licence fees or user limits)

## Suggested follow-up prompts

1. "Re-run the Snowflake estimate assuming Dev uses zero-copy clones and sampled data, and show the saving."
2. "Re-price the open-source stack for 5 TB of marts and 500 concurrent users, and state where DuckDB on a single node stops being viable."
3. "Compare managed-service fees against hiring one mid-level data engineer in Cape Town, in USD and ZAR."
4. "Build a one-page executive POC success scorecard: metrics, parity tests, cost-to-run, and go/no-go thresholds."
