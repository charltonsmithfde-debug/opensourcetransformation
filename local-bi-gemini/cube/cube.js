/**
 * cube.js - E-Commerce Semantic Layer Configuration
 * Running embedded DuckDB over Google Cloud Storage Parquet Lakehouse
 */

const DuckDBDriver = require('@cubejs-backend/duckdb-driver');
const crypto = require('crypto');

const GCS_ACCESS_KEY = process.env.CUBEJS_DB_DUCKDB_S3_ACCESS_KEY_ID;
const GCS_SECRET_KEY = process.env.CUBEJS_DB_DUCKDB_S3_SECRET_ACCESS_KEY;
const BUCKET = process.env.DUCKLAKE_GCS_BUCKET || 'scbi-ducklake-myanalyticsproduct';

const initSql = `
INSTALL httpfs;
LOAD httpfs;
SET s3_endpoint = 'storage.googleapis.com';
SET s3_url_style = 'path';
SET s3_access_key_id = '${GCS_ACCESS_KEY}';
SET s3_secret_access_key = '${GCS_SECRET_KEY}';
SET memory_limit = '3.5GB';
SET preserve_insertion_order = false;

CREATE SCHEMA IF NOT EXISTS ecommerce_mart;

-- 1. Date Dimension
CREATE OR REPLACE VIEW ecommerce_mart.dim_date AS
SELECT * FROM read_parquet('s3://${BUCKET}/scbi_sdp_mart/dim_date/*.parquet');

-- 2. Customer Dimension (Anonymized & Segmented)
CREATE OR REPLACE VIEW ecommerce_mart.dim_customer AS
SELECT 
  MEMBER_HK as customer_hk,
  'CUST-' || SUBSTR(MEMBER_HK, 1, 8) as customer_code,
  COALESCE(MEMBER_GENDER, 'U') as customer_gender,
  COALESCE(MEMBER_MARITAL_STATUS, 'Standard') as account_type,
  CASE 
    WHEN MEMBER_AGE_BAND IN ('18-24', '25-29') THEN 'Young Adult (18-29)'
    WHEN MEMBER_AGE_BAND IN ('30-39', '40-49') THEN 'Core Demographic (30-49)'
    WHEN MEMBER_AGE_BAND IN ('50-59', '60+') THEN 'VIP Premier Tier (50+)'
    ELSE 'Standard Retail'
  END as customer_segment
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__dim_member/*.parquet');

-- 3. Product Catalog & Category Dimension
CREATE OR REPLACE VIEW ecommerce_mart.dim_product_category AS
SELECT 
  FUND_HK as category_hk,
  COALESCE(FUND_NAME, 'General Merchandise') as product_line,
  CASE 
    WHEN FUND_OPTION_TYPE LIKE '%Equity%' OR FUND_CLASSIFICATION LIKE '%Equity%' THEN 'Consumer Electronics'
    WHEN FUND_OPTION_TYPE LIKE '%Balanced%' OR FUND_CLASSIFICATION LIKE '%Balanced%' THEN 'Apparel & Designer Wear'
    WHEN FUND_OPTION_TYPE LIKE '%Bond%' OR FUND_CLASSIFICATION LIKE '%Bond%' THEN 'Home, Kitchen & Living'
    ELSE 'Health, Beauty & Sports'
  END as product_category
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__dim_fund/*.parquet');

-- 4. Sales Channel Dimension
CREATE OR REPLACE VIEW ecommerce_mart.dim_sales_channel AS
SELECT 
  CLIENT_HK as channel_hk,
  CLIENT_NAME as channel_account,
  CASE 
    WHEN CLIENT_HK LIKE '%0%' OR CLIENT_HK LIKE '%1%' OR CLIENT_HK LIKE '%2%' THEN 'Shopify Storefront (Direct)'
    WHEN CLIENT_HK LIKE '%3%' OR CLIENT_HK LIKE '%4%' OR CLIENT_HK LIKE '%5%' THEN 'Amazon FBA Marketplace'
    WHEN CLIENT_HK LIKE '%6%' OR CLIENT_HK LIKE '%7%' THEN 'Mobile App (iOS/Android)'
    ELSE 'B2B Wholesale Portal'
  END as sales_channel
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__dim_client/*.parquet');

-- 5. Regional Fulfillment Hub Dimension
CREATE OR REPLACE VIEW ecommerce_mart.dim_fulfillment_center AS
SELECT 
  EMPLOYER_HK as fulfillment_hk,
  EMPLOYER_NAME as facility_partner,
  CASE 
    WHEN EMPLOYER_HK LIKE '%a%' OR EMPLOYER_HK LIKE '%b%' THEN 'US-East Regional DC (NJ)'
    WHEN EMPLOYER_HK LIKE '%c%' OR EMPLOYER_HK LIKE '%d%' THEN 'West Coast Hub (Ontario, CA)'
    WHEN EMPLOYER_HK LIKE '%e%' OR EMPLOYER_HK LIKE '%f%' THEN 'Central Distribution (Dallas, TX)'
    ELSE 'EU Central Fulfillment (Amsterdam)'
  END as warehouse_location
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__dim_employer/*.parquet');

-- 6. Core Fact Orders Table (29.2M Rows)
CREATE OR REPLACE VIEW ecommerce_mart.fact_orders AS
SELECT 
  MEMBER_HK as customer_hk,
  FUND_HK as category_hk,
  CLIENT_HK as channel_hk,
  EMPLOYER_HK as fulfillment_hk,
  DATE_SK as date_sk,
  AUA_AMOUNT as order_gross_value,
  ROUND(AUA_AMOUNT * 0.18, 2) as estimated_gross_profit
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__fact_member_investment_aua/*.parquet');

-- 7. Checkout Funnel & Abandoned Carts Fact Table
CREATE OR REPLACE VIEW ecommerce_mart.fact_checkouts AS
SELECT 
  QUOTATION_NUMBER as checkout_session_id,
  DATE_SK as date_sk,
  QUOTATION_PURCHASE_PRICE as checkout_cart_value,
  CASE 
    WHEN DERIVED_QUOTATION_STATUS LIKE '%ACCEPT%' THEN 'Completed Checkout'
    WHEN DERIVED_QUOTATION_STATUS LIKE '%EXPIR%' THEN 'Abandoned at Payment'
    ELSE 'Abandoned at Shipping'
  END as checkout_funnel_status
FROM read_parquet('s3://${BUCKET}/scbi_cdp_mart/cnf__fact_annuity_quotations/*.parquet');
`;

const ROLE_PERMISSIONS = {
  ROLE_ECOMMERCE_EXECUTIVE: {
    allowedCubes: ['*'],
    canViewPii: true,
    description: 'Executive Access with Full Visibility'
  },
  ROLE_ECOMMERCE_ANALYST: {
    allowedCubes: [
      'EcommerceOrders',
      'CheckoutFunnel',
      'CustomerAnalytics',
      'DimCustomer',
      'DimDate',
      'DimProductCategory',
      'DimSalesChannel',
      'DimFulfillmentCenter'
    ],
    canViewPii: false,
    description: 'E-Commerce Analyst Role'
  }
};

const SHARED_DIMENSIONS = [
  'DimDate',
  'DimProductCategory',
  'DimSalesChannel',
  'DimFulfillmentCenter',
  'DimCustomer'
];

module.exports = {
  driverFactory: () => {
    return new DuckDBDriver({
      initSql: initSql
    });
  },

  checkSqlAuth: async (req, auth) => {
    const username = (auth?.u || auth?.user || '').trim().toLowerCase();
    const password = auth?.password || auth?.p || '';
    return {
      password: password,
      securityContext: {
        user: username || 'metabase_analyst',
        role: 'ROLE_ECOMMERCE_ANALYST',
        canViewPii: false
      }
    };
  },

  contextToAppId: ({ securityContext }) => {
    const role = securityContext?.role || 'ROLE_ECOMMERCE_ANALYST';
    return `CUBE_APP_${role}`;
  },

  queryRewrite: (query, { securityContext }) => {
    return query;
  }
};
