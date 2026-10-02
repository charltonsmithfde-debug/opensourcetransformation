cube('CustomerAnalytics', {
  sql: `
    SELECT 
      c.customer_hk,
      c.customer_code,
      c.customer_segment,
      c.customer_gender,
      COUNT(f.date_sk) as lifetime_orders,
      SUM(f.order_gross_value) as lifetime_gmv,
      AVG(f.order_gross_value) as customer_aov
    FROM ecommerce_mart.dim_customer c
    JOIN ecommerce_mart.fact_orders f ON c.customer_hk = f.customer_hk
    GROUP BY 1, 2, 3, 4
  `,

  measures: {
    totalCustomers: {
      type: 'count',
      title: 'Total Tracked Customers'
    },
    avgLifetimeGmv: {
      sql: 'lifetime_gmv',
      type: 'avg',
      format: 'currency',
      title: 'Avg Customer Lifetime GMV'
    }
  },

  dimensions: {
    customerHk: {
      sql: 'customer_hk',
      type: 'string',
      primaryKey: true
    },
    customerCode: {
      sql: 'customer_code',
      type: 'string',
      title: 'Customer ID (Masked)'
    },
    customerSegment: {
      sql: 'customer_segment',
      type: 'string',
      title: 'Customer Segment'
    },
    customerGender: {
      sql: 'customer_gender',
      type: 'string'
    },
    lifetimeGmv: {
      sql: 'lifetime_gmv',
      type: 'number',
      format: 'currency'
    }
  }
});

cube('CheckoutFunnel', {
  sql: `SELECT * FROM ecommerce_mart.fact_checkouts`,

  measures: {
    totalCheckoutSessions: {
      type: 'count',
      title: 'Total Initiated Checkouts'
    },
    abandonedCheckoutGmv: {
      sql: 'checkout_cart_value',
      type: 'sum',
      format: 'currency',
      title: 'Abandoned Checkout Value'
    }
  },

  dimensions: {
    checkoutSessionId: {
      sql: 'checkout_session_id',
      type: 'string',
      primaryKey: true
    },
    funnelStatus: {
      sql: 'checkout_funnel_status',
      type: 'string',
      title: 'Funnel State'
    },
    cartValue: {
      sql: 'checkout_cart_value',
      type: 'number',
      format: 'currency'
    }
  }
});
