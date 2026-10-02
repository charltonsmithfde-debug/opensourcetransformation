cube('EcommerceOrders', {
  sql: `SELECT * FROM ecommerce_mart.fact_orders`,

  joins: {
    DimDate: {
      sql: `${CUBE}.date_sk = ${DimDate}.date_sk`,
      relationship: 'belongsTo'
    },
    DimSalesChannel: {
      sql: `${CUBE}.channel_hk = ${DimSalesChannel}.channel_hk`,
      relationship: 'belongsTo'
    },
    DimProductCategory: {
      sql: `${CUBE}.category_hk = ${DimProductCategory}.category_hk`,
      relationship: 'belongsTo'
    },
    DimFulfillmentCenter: {
      sql: `${CUBE}.fulfillment_hk = ${DimFulfillmentCenter}.fulfillment_hk`,
      relationship: 'belongsTo'
    },
    DimCustomer: {
      sql: `${CUBE}.customer_hk = ${DimCustomer}.customer_hk`,
      relationship: 'belongsTo'
    }
  },

  measures: {
    grossMerchandiseValue: {
      sql: 'order_gross_value',
      type: 'sum',
      format: 'currency',
      title: 'Gross Merchandise Value (GMV)'
    },
    averageOrderValue: {
      sql: 'order_gross_value',
      type: 'avg',
      format: 'currency',
      title: 'Average Order Value (AOV)'
    },
    totalOrders: {
      type: 'count',
      title: 'Total Completed Orders'
    },
    activeCustomers: {
      sql: 'customer_hk',
      type: 'countDistinct',
      title: 'Active Purchasing Customers'
    },
    grossProfit: {
      sql: 'estimated_gross_profit',
      type: 'sum',
      format: 'currency',
      title: 'Estimated Gross Profit'
    }
  },

  dimensions: {
    orderGrossValue: {
      sql: 'order_gross_value',
      type: 'number'
    },
    dateSk: {
      sql: 'date_sk',
      type: 'number',
      primaryKey: true
    }
  },

  preAggregations: {
    executivePerformanceRollup: {
      measures: [
        EcommerceOrders.grossMerchandiseValue,
        EcommerceOrders.totalOrders,
        EcommerceOrders.averageOrderValue,
        EcommerceOrders.grossProfit
      ],
      dimensions: [
        DimSalesChannel.salesChannel,
        DimProductCategory.productCategory,
        DimDate.calendarYear
      ]
    }
  }
});
