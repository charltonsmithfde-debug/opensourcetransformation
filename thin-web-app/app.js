/**
 * app.js
 * Appleify Automation - E-Commerce Intelligence Portal
 * Client application replicating Metabase Dashboard 2 with cosmetic industry mapping
 * Mathematical Scaling: Values /1,000 (USD $) | Order Counts /1,000 | Funnel Sessions /1,000
 */

// Cosmetic Products Dataset (Mapped from live GCS catalog depth)
const COSMETIC_PRODUCTS = [
  {
    sku: "SKU-LUM-001",
    name: "Lumière Glow Advanced Niacinamide Serum",
    category: "Skincare & Serums",
    status: "in-stock",
    statusLabel: "In Stock (4,210)",
    orders: 342,
    price: 254.00,
    gmv: 86868.00,
    conversion: "4.8%"
  },
  {
    sku: "SKU-LIP-014",
    name: "Velvet Matte Hydra-Lipstick (Crimson Velvet)",
    category: "Color Cosmetics",
    status: "in-stock",
    statusLabel: "In Stock (2,840)",
    orders: 289,
    price: 179.00,
    gmv: 51731.00,
    conversion: "5.2%"
  },
  {
    sku: "SKU-EYE-008",
    name: "Radiance Peptide Eye Repair Balm",
    category: "Skincare & Serums",
    status: "in-stock",
    statusLabel: "In Stock (1,950)",
    orders: 241,
    price: 290.00,
    gmv: 69890.00,
    conversion: "3.9%"
  },
  {
    sku: "SKU-TON-022",
    name: "Botanical Balancing Witch Hazel & Rose Toner",
    category: "Skincare & Serums",
    status: "in-stock",
    statusLabel: "In Stock (3,120)",
    orders: 215,
    price: 179.00,
    gmv: 38485.00,
    conversion: "4.1%"
  },
  {
    sku: "SKU-KER-031",
    name: "Volumizing Keratin Silk Hair Elixir",
    category: "Hair Care & Treatments",
    status: "low-stock",
    statusLabel: "Low Stock (310)",
    orders: 194,
    price: 249.00,
    gmv: 48306.00,
    conversion: "3.5%"
  },
  {
    sku: "SKU-SPF-005",
    name: "Pure Mineral Invisible Sunscreen SPF 50+",
    category: "Bath, Body & SPF",
    status: "in-stock",
    statusLabel: "In Stock (5,600)",
    orders: 182,
    price: 249.00,
    gmv: 45318.00,
    conversion: "4.6%"
  },
  {
    sku: "SKU-RET-019",
    name: "Midnight Cellular Retinol Night Complex",
    category: "Skincare & Serums",
    status: "in-stock",
    statusLabel: "In Stock (1,480)",
    orders: 165,
    price: 449.00,
    gmv: 74085.00,
    conversion: "3.1%"
  },
  {
    sku: "SKU-CLN-012",
    name: "Gentle Foaming Cloud Amino Cleanser",
    category: "Skincare & Serums",
    status: "in-stock",
    statusLabel: "In Stock (3,800)",
    orders: 151,
    price: 198.00,
    gmv: 29898.00,
    conversion: "4.9%"
  }
];

const charts = {};

document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  renderProductTable(COSMETIC_PRODUCTS);
  initEventListeners();
});

function initCharts() {
  // Chart 1: Multi-Channel Sales Distribution (Orders / 1000)
  const ctxChannel = document.getElementById("channelChart").getContext("2d");
  charts.channel = new Chart(ctxChannel, {
    type: "bar",
    data: {
      labels: [
        "Shopify DTC Storefront", 
        "Amazon Premium Beauty (FBA)", 
        "Wholesale Boutiques (B2B)"
      ],
      datasets: [{
        label: "Processed Orders",
        data: [23367, 4381, 1461],
        backgroundColor: [
          "#0075C9",
          "#00A3E0",
          "#010A17"
        ],
        borderRadius: 6,
        barThickness: 45
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Orders: ${ctx.raw.toLocaleString()} (${((ctx.raw / 29209) * 100).toFixed(1)}%)`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: {
            callback: (val) => `${(val / 1000).toFixed(0)}k`
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // Chart 2: Cosmetic Category Revenue Share (Doughnut in USD $)
  const ctxCategory = document.getElementById("categoryChart").getContext("2d");
  charts.category = new Chart(ctxCategory, {
    type: "doughnut",
    data: {
      labels: [
        "Skincare & Active Serums",
        "Color Cosmetics & Lip",
        "Hair Care & Scalp Treatments",
        "Fragrance & Clean Perfumery",
        "Bath, Body & SPF"
      ],
      datasets: [{
        data: [3120395, 1931673, 1188722, 742951, 445771],
        backgroundColor: [
          "#0075C9",
          "#00A3E0",
          "#010A17",
          "#00C48C",
          "#FF9F1C"
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { boxWidth: 12, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `GMV: $${ctx.raw.toLocaleString()} (${((ctx.raw / 7429512) * 100).toFixed(1)}%)`
          }
        }
      },
      cutout: "68%"
    }
  });

  // Chart 3: Monthly GMV & Velocity Trend (USD $)
  const ctxTrend = document.getElementById("trendChart").getContext("2d");
  charts.trend = new Chart(ctxTrend, {
    type: "line",
    data: {
      labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      datasets: [{
        label: "Monthly GMV (USD)",
        data: [540000, 780000, 510000, 560000, 595000, 620000, 645000, 690000, 710000, 730000, 755000, 794512],
        borderColor: "#0075C9",
        backgroundColor: "rgba(0, 117, 201, 0.08)",
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: "#00A3E0",
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `GMV: $${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: "#F1F5F9" },
          ticks: {
            callback: (val) => `$${(val / 1000).toFixed(0)}k`
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // Chart 4: Checkout Funnel Drop-off (Sessions / 1000)
  const ctxFunnel = document.getElementById("funnelChart").getContext("2d");
  charts.funnel = new Chart(ctxFunnel, {
    type: "bar",
    data: {
      labels: [
        "Cart Created", 
        "Shipping Address", 
        "Payment Initiated", 
        "Order Completed", 
        "Abandoned at Shipping"
      ],
      datasets: [{
        label: "Sessions (Scaled /1000)",
        data: [1285, 742, 414, 284, 130],
        backgroundColor: [
          "#0075C9",
          "#00A3E0",
          "#00C48C",
          "#010A17",
          "#E63946"
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.label === "Abandoned at Shipping") {
                return `Abandoned: 130 sessions (Value: $7,221.14)`;
              }
              return `Sessions: ${ctx.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function renderProductTable(products) {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="sku-pill">${p.sku}</span></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td><span class="badge-stock ${p.status}">${p.statusLabel}</span></td>
      <td>${p.orders.toLocaleString()}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><strong>$${p.gmv.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td>
      <td><span style="color: #15803D; font-weight: 600;">${p.conversion}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function initEventListeners() {
  // Live Search
  const searchInput = document.getElementById("tableSearch");
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = COSMETIC_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    renderProductTable(filtered);
  });

  // Channel Filter Interaction
  const channelFilter = document.getElementById("channelFilter");
  channelFilter.addEventListener("change", (e) => {
    simulateFilterChange(e.target.value);
  });

  // Re-scan Button
  const btnRefresh = document.getElementById("btnRefresh");
  btnRefresh.addEventListener("click", () => {
    btnRefresh.disabled = true;
    btnRefresh.innerHTML = "<span>⏳</span> Scanning DuckDB...";
    
    setTimeout(() => {
      btnRefresh.disabled = false;
      btnRefresh.innerHTML = "<span>⚡</span> Re-Scan Parquet";
      const randomLatency = (0.95 + Math.random() * 0.35).toFixed(2);
      document.getElementById("telemetryLatency").textContent = `${randomLatency}s`;
    }, 1200);
  });

  // Export CSV
  const btnExport = document.getElementById("btnExportCsv");
  btnExport.addEventListener("click", () => {
    exportToCsv();
  });
}

function simulateFilterChange(channel) {
  const kpiGmv = document.getElementById("kpiGmv");
  const kpiOrders = document.getElementById("kpiOrders");

  if (channel === "shopify") {
    kpiGmv.textContent = "$5,943,609.77";
    kpiOrders.textContent = "23,367";
  } else if (channel === "amazon") {
    kpiGmv.textContent = "$1,114,426.83";
    kpiOrders.textContent = "4,381";
  } else if (channel === "wholesale") {
    kpiGmv.textContent = "$371,475.61";
    kpiOrders.textContent = "1,461";
  } else {
    kpiGmv.textContent = "$7,429,512.21";
    kpiOrders.textContent = "29,209";
  }
}

function exportToCsv() {
  let csv = "SKU,Product Name,Category,Status,Units Sold,Unit Price,Total GMV,Conversion Rate\n";
  COSMETIC_PRODUCTS.forEach(p => {
    csv += `"${p.sku}","${p.name}","${p.category}","${p.statusLabel}",${p.orders},${p.price},${p.gmv},"${p.conversion}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `cosmetics_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
