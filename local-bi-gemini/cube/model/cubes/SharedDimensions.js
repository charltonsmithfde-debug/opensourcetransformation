cube('DimDate', {
  sql: `SELECT * FROM ecommerce_mart.dim_date`,
  dimensions: {
    dateSk: {
      sql: 'date_sk',
      type: 'number',
      primaryKey: true,
      shown: true
    },
    dateNk: {
      sql: 'date_nk',
      type: 'time'
    },
    calendarYear: {
      sql: 'calendar_year',
      type: 'number',
      shown: true
    },
    calendarMonthSk: {
      sql: 'calendar_month_sk',
      type: 'number',
      shown: true
    },
    formattedDate: {
      sql: `UPPER(STRFTIME(date_nk, '%d-%b-%Y'))`,
      type: 'string'
    }
  }
});

cube('DimCustomer', {
  sql: `SELECT * FROM ecommerce_mart.dim_customer`,
  dimensions: {
    customerHk: {
      sql: 'customer_hk',
      type: 'string',
      primaryKey: true
    },
    customerCode: {
      sql: 'customer_code',
      type: 'string'
    },
    customerGender: {
      sql: 'customer_gender',
      type: 'string'
    },
    customerSegment: {
      sql: 'customer_segment',
      type: 'string'
    },
    accountType: {
      sql: 'account_type',
      type: 'string'
    }
  }
});

cube('DimProductCategory', {
  sql: `SELECT * FROM ecommerce_mart.dim_product_category`,
  dimensions: {
    categoryHk: {
      sql: 'category_hk',
      type: 'string',
      primaryKey: true
    },
    productLine: {
      sql: 'product_line',
      type: 'string'
    },
    productCategory: {
      sql: 'product_category',
      type: 'string'
    }
  }
});

cube('DimSalesChannel', {
  sql: `SELECT * FROM ecommerce_mart.dim_sales_channel`,
  dimensions: {
    channelHk: {
      sql: 'channel_hk',
      type: 'string',
      primaryKey: true
    },
    channelAccount: {
      sql: 'channel_account',
      type: 'string'
    },
    salesChannel: {
      sql: 'sales_channel',
      type: 'string'
    }
  }
});

cube('DimFulfillmentCenter', {
  sql: `SELECT * FROM ecommerce_mart.dim_fulfillment_center`,
  dimensions: {
    fulfillmentHk: {
      sql: 'fulfillment_hk',
      type: 'string',
      primaryKey: true
    },
    facilityPartner: {
      sql: 'facility_partner',
      type: 'string'
    },
    warehouseLocation: {
      sql: 'warehouse_location',
      type: 'string'
    }
  }
});
