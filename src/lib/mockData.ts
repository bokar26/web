// KPI metrics for dashboard
export const kpis = [
  { 
    title: 'Cash Conversion Cycle', 
    value: '66 days', 
    change: '-4.1%', 
    trend: 'down' as const 
  },
  { 
    title: 'Avg Landed Cost / unit', 
    value: '$6.42', 
    change: '-8.1%', 
    trend: 'down' as const 
  },
  { 
    title: 'Avg Shipping Time', 
    value: '25 days', 
    change: '-10.7%', 
    trend: 'down' as const 
  },
  { 
    title: 'On-Time Delivery', 
    value: '96%', 
    change: '+3.1%', 
    trend: 'up' as const 
  },
];

// Secondary metrics for dashboard
export const secondaryMetrics = [
  {
    title: "Backorder %",
    value: "2.3%",
    change: "↓ 0.5%",
    trend: "down" as const
  },
  {
    title: "Stock-out %",
    value: "1.8%",
    change: "↓ 0.3%",
    trend: "down" as const
  },
  {
    title: "Cost Variance",
    value: "+3.2%",
    change: "↑ 1.1%",
    trend: "up" as const
  },
  {
    title: "Forecast Accuracy",
    value: "94.5%",
    change: "↑ 2.1%",
    trend: "down" as const
  }
];

// Weekly trend data for charts
export const cccTrendData = [
  { date: '2024-01-01', value: 72 },
  { date: '2024-01-08', value: 70 },
  { date: '2024-01-15', value: 68 },
  { date: '2024-01-22', value: 69 },
  { date: '2024-01-29', value: 67 },
  { date: '2024-02-05', value: 66 },
  { date: '2024-02-12', value: 65 },
  { date: '2024-02-19', value: 66 },
  { date: '2024-02-26', value: 64 },
  { date: '2024-03-05', value: 63 },
  { date: '2024-03-12', value: 65 },
  { date: '2024-03-19', value: 66 },
];

export const shipTimeTrendData = [
  { date: '2024-01-01', value: 28 },
  { date: '2024-01-08', value: 27 },
  { date: '2024-01-15', value: 26 },
  { date: '2024-01-22', value: 25 },
  { date: '2024-01-29', value: 24 },
  { date: '2024-02-05', value: 25 },
  { date: '2024-02-12', value: 24 },
  { date: '2024-02-19', value: 23 },
  { date: '2024-02-26', value: 24 },
  { date: '2024-03-05', value: 25 },
  { date: '2024-03-12', value: 24 },
  { date: '2024-03-19', value: 25 },
];

// Additional dashboard metrics
export const additionalMetrics = [
  { title: 'Total Revenue', value: '$265,000', subtitle: 'last 30 days' },
  { title: 'Commission', value: '$68,375', subtitle: 'last 30 days' },
  { title: 'Open Orders', value: '4', subtitle: 'live' },
  { title: 'Time Saved', value: '12h', subtitle: '30-day total' },
];

// Goal tracking
export const currentGoal = {
  title: 'Increase Q4 shipping speed by 18%',
  current: 6,
  target: 18,
  unit: '%',
  progress: 6,
  percentOfGoal: 33.3,
};

// Vendor regional breakdown data
export const vendorBreakdownData = [
  { name: 'Mainland China', value: 42, color: '#34c759' },
  { name: 'Bangladesh', value: 13, color: '#10b981' },
  { name: 'Vietnam', value: 18, color: '#059669' },
  { name: 'India', value: 12, color: '#047857' },
  { name: 'Pakistan', value: 8, color: '#065f46' },
  { name: 'Turkey', value: 7, color: '#064e3b' },
];

// SLA Suggestions
export const slaSuggestions = [
  {
    title: 'Shift CN→EU lanes with ≥10d slack from sea to rail',
    description: 'Applies to ~27% of CN→EU orders.',
    impact: '+4% toward Q4 goal',
    type: 'optimization' as const,
  },
];

// SLA Health Data
export const slaHealthData = {
  current: 92,
  target: 95,
  status: 'stable' as 'stable' | 'declining' | 'improving'
}

// At-Risk Entities
export const atRiskEntities = [
  { id: 1, name: 'Supplier ABC', type: 'supplier', severity: 'high', reason: 'Delayed shipment' },
  { id: 2, name: 'Shipment #4521', type: 'shipment', severity: 'medium', reason: '2 days behind' },
  { id: 3, name: 'Factory XYZ', type: 'factory', severity: 'low', reason: 'Quality check pending' },
  { id: 4, name: 'Carrier DEF', type: 'carrier', severity: 'high', reason: 'Route disruption' },
  { id: 5, name: 'Warehouse GHI', type: 'warehouse', severity: 'medium', reason: 'Capacity at 95%' }
]

// Map Pins Data
export const mapPins = [
  { id: 1, lat: 31.2, lng: 121.5, name: 'Shanghai Factory', status: 'green', details: 'Production on schedule' },
  { id: 2, lat: 23.1, lng: 113.3, name: 'Guangzhou Supplier', status: 'amber', details: 'Minor delays expected' },
  { id: 3, lat: 22.3, lng: 114.2, name: 'Hong Kong Port', status: 'green', details: 'Operations normal' },
  { id: 4, lat: 35.7, lng: 139.7, name: 'Tokyo Warehouse', status: 'red', details: 'Capacity issues' },
  { id: 5, lat: 37.8, lng: -122.4, name: 'San Francisco Port', status: 'amber', details: 'Weather delays' },
  { id: 6, lat: 40.7, lng: -74.0, name: 'New York Hub', status: 'green', details: 'All systems operational' }
]

// Cost Composition Data
export const costCompositionData = [
  { category: 'Product', value: 65, color: '#10b981' },
  { category: 'Freight', value: 20, color: '#3b82f6' },
  { category: 'Duty', value: 10, color: '#f59e0b' },
  { category: 'Other', value: 5, color: '#6b7280' }
]

// Inventory Forecast Data
export const inventoryForecastData = [
  { region: 'North America', forecasted: 5200, actual: 4800 },
  { region: 'Europe', forecasted: 3800, actual: 3950 },
  { region: 'Asia Pacific', forecasted: 6200, actual: 6100 },
  { region: 'Latin America', forecasted: 1800, actual: 1750 }
]

// Activity Timeline Data
export const activityTimeline = [
  { id: 1, type: 'shipment', icon: '🚚', text: 'Shipment #4521 departed Shanghai', timestamp: '2024-03-19T14:30:00Z' },
  { id: 2, type: 'breach', icon: '⚠', text: 'SLA breach: Supplier XYZ delayed', timestamp: '2024-03-19T12:15:00Z' },
  { id: 3, type: 'sync', icon: '🔄', text: 'ERP data synchronized', timestamp: '2024-03-19T10:45:00Z' },
  { id: 4, type: 'shipment', icon: '🚚', text: 'Shipment #4520 arrived LA Port', timestamp: '2024-03-19T08:20:00Z' },
  { id: 5, type: 'info', icon: '📊', text: 'Weekly report generated', timestamp: '2024-03-19T06:00:00Z' },
  { id: 6, type: 'sync', icon: '🔄', text: 'Inventory levels updated', timestamp: '2024-03-18T22:30:00Z' }
]

// Plan Section Data

// Shipping Plans Data
export const shippingPlans = [
  { 
    id: 1, 
    origin: { lat: 31.2, lng: 121.5, name: 'Shanghai' },
    destination: { lat: 34.05, lng: -118.24, name: 'Los Angeles' },
    carrier: 'MSC',
    currentETA: '2024-04-15',
    currentCost: 2450,
    recommendedRoute: 'via Singapore',
    recommendedETA: '2024-04-13',
    recommendedCost: 2416,
    status: 'active',
    savings: 34,
    timeSaved: 2
  },
  { 
    id: 2, 
    origin: { lat: 22.3, lng: 114.2, name: 'Hong Kong' },
    destination: { lat: 40.7, lng: -74.0, name: 'New York' },
    carrier: 'COSCO',
    currentETA: '2024-04-20',
    currentCost: 3200,
    recommendedRoute: 'via Panama Canal',
    recommendedETA: '2024-04-18',
    recommendedCost: 3100,
    status: 'active',
    savings: 100,
    timeSaved: 2
  },
  { 
    id: 3, 
    origin: { lat: 35.7, lng: 139.7, name: 'Tokyo' },
    destination: { lat: 37.8, lng: -122.4, name: 'San Francisco' },
    carrier: 'ONE',
    currentETA: '2024-04-12',
    currentCost: 1800,
    recommendedRoute: 'direct route',
    recommendedETA: '2024-04-10',
    recommendedCost: 1750,
    status: 'active',
    savings: 50,
    timeSaved: 2
  }
]

// Inventory Plans Data
export const inventoryPlans = [
  {
    sku: 'TEE-BLK-M',
    location: 'Warehouse LA',
    currentQty: 450,
    forecastedDemand: 680,
    safetyStockDays: 12,
    reorderQty: 230,
    reorderDate: '2024-03-25',
    riskLevel: 'medium'
  },
  {
    sku: 'JEAN-BLU-L',
    location: 'Warehouse NY',
    currentQty: 120,
    forecastedDemand: 200,
    safetyStockDays: 8,
    reorderQty: 80,
    reorderDate: '2024-03-22',
    riskLevel: 'high'
  },
  {
    sku: 'HOOD-GRY-XL',
    location: 'Warehouse CHI',
    currentQty: 890,
    forecastedDemand: 750,
    safetyStockDays: 18,
    reorderQty: 0,
    reorderDate: '2024-04-15',
    riskLevel: 'low'
  }
]

export const demandForecastData = [
  { date: '2024-03-20', forecast: 120, actual: 115 },
  { date: '2024-03-21', forecast: 125, actual: 130 },
  { date: '2024-03-22', forecast: 110, actual: 108 },
  { date: '2024-03-23', forecast: 135, actual: 140 },
  { date: '2024-03-24', forecast: 140, actual: 135 },
  { date: '2024-03-25', forecast: 130, actual: 128 },
  { date: '2024-03-26', forecast: 145, actual: 150 }
]

// Demand Forecast Data
export const forecastVersions = [
  { id: 'baseline-v1', name: 'Baseline', createdAt: '2024-03-01' },
  { id: 'ai-v2', name: 'AI Updated', createdAt: '2024-03-15' }
]

export const forecastAccuracy = {
  mae: 42,
  mape: 8.5,
  bias: -2.1
}

// Cost Projections Data
export const costEstimatorInputs = {
  quantity: 1000,
  port: 'Shanghai',
  transportMode: 'Sea',
  incoterm: 'FOB',
  dutyEnabled: true
}

// Manage Section Data

// Financial Data
export const financialData = {
  costComposition: [
    { category: 'Product', value: 65, color: '#10b981' },
    { category: 'Freight', value: 20, color: '#3b82f6' },
    { category: 'Duty', value: 10, color: '#f59e0b' },
    { category: 'Other', value: 5, color: '#6b7280' }
  ],
  costPerUnitTrend: [
    { date: '2024-01-01', cost: 6.8 },
    { date: '2024-01-08', cost: 6.6 },
    { date: '2024-01-15', cost: 6.4 },
    { date: '2024-01-22', cost: 6.5 },
    { date: '2024-01-29', cost: 6.3 },
    { date: '2024-02-05', cost: 6.2 },
    { date: '2024-02-12', cost: 6.1 },
    { date: '2024-02-19', cost: 6.2 },
    { date: '2024-02-26', cost: 6.0 },
    { date: '2024-03-05', cost: 5.9 },
    { date: '2024-03-12', cost: 6.1 },
    { date: '2024-03-19', cost: 6.4 }
  ],
  marginByProduct: [
    { product: 'TEE-BLK-M', route: 'Shanghai → LA', margin: 23.5, variance: -2.1, flag: 'warning' },
    { product: 'JEAN-BLU-L', route: 'Hong Kong → NY', margin: 18.2, variance: 1.3, flag: 'good' },
    { product: 'HOOD-GRY-XL', route: 'Tokyo → SF', margin: 31.8, variance: 0.8, flag: 'good' },
    { product: 'SHIRT-WHT-S', route: 'Singapore → LA', margin: 15.6, variance: -4.2, flag: 'critical' }
  ],
  anomalies: [
    { type: 'freight_spike', description: 'Freight cost +12% this week', severity: 'high' },
    { type: 'duty_increase', description: 'Duty rates increased for EU imports', severity: 'medium' }
  ]
}

// Customer Metrics Data
export const customerMetrics = [
  { 
    name: 'Zara', 
    otdPercent: 97, 
    fillRate: 94, 
    revenue: 125000, 
    health: 'excellent',
    slaCompliance: 96,
    recentOrders: 12,
    breachCount: 1
  },
  { 
    name: 'H&M', 
    otdPercent: 89, 
    fillRate: 87, 
    revenue: 98000, 
    health: 'good',
    slaCompliance: 89,
    recentOrders: 8,
    breachCount: 3
  },
  { 
    name: 'Uniqlo', 
    otdPercent: 95, 
    fillRate: 92, 
    revenue: 112000, 
    health: 'excellent',
    slaCompliance: 94,
    recentOrders: 15,
    breachCount: 0
  },
  { 
    name: 'Gap', 
    otdPercent: 82, 
    fillRate: 79, 
    revenue: 76000, 
    health: 'at-risk',
    slaCompliance: 81,
    recentOrders: 6,
    breachCount: 7
  }
]

// Purchase Orders Data
export const purchaseOrders = [
  {
    id: 'PO-2024-0123',
    supplier: {
      name: 'ABC Textiles',
      contact: {
        email: 'orders@abctextiles.com'
      }
    },
    region: 'Asia Pacific',
    orderDate: '2024-03-15',
    status: 'shipped',
    eta: '2024-04-10',
    actualDelivery: '2024-04-12',
    slaStatus: 'at-risk',
    items: 450,
    amount: 12500,
    progress: 85
  },
  {
    id: 'PO-2024-0124',
    supplier: {
      name: 'XYZ Manufacturing',
      contact: {
        email: 'orders@xyzmanufacturing.com'
      }
    },
    region: 'North America',
    orderDate: '2024-03-20',
    status: 'confirmed',
    eta: '2024-04-15',
    actualDelivery: null,
    slaStatus: 'on-time',
    items: 320,
    amount: 8900,
    progress: 45
  },
  {
    id: 'PO-2024-0125',
    supplier: {
      name: 'DEF Garments',
      contact: {
        email: 'orders@defgarments.com'
      }
    },
    region: 'Europe',
    orderDate: '2024-03-10',
    status: 'delivered',
    eta: '2024-04-05',
    actualDelivery: '2024-04-03',
    slaStatus: 'on-time',
    items: 280,
    amount: 7200,
    progress: 100
  },
  {
    id: 'PO-2024-0126',
    supplier: {
      name: 'GHI Fabrics',
      contact: {
        email: 'orders@ghifabrics.com'
      }
    },
    region: 'Asia Pacific',
    orderDate: '2024-03-25',
    status: 'ordered',
    eta: '2024-04-20',
    actualDelivery: null,
    slaStatus: 'on-time',
    items: 150,
    amount: 4200,
    progress: 15
  }
]

// Compliance Data
export const complianceRecords = [
  {
    partner: 'Factory XYZ',
    certification: 'ISO 9001',
    status: 'active',
    expiryDate: '2025-06-30',
    auditor: 'SGS',
    score: 92,
    correctiveActions: []
  },
  {
    partner: 'Supplier ABC',
    certification: 'BSCI',
    status: 'expiring',
    expiryDate: '2024-05-15',
    auditor: 'TÜV',
    score: 88,
    correctiveActions: [
      { action: 'Update safety protocols', dueDate: '2024-04-01', status: 'pending' }
    ]
  },
  {
    partner: 'Manufacturer DEF',
    certification: 'WRAP',
    status: 'active',
    expiryDate: '2025-12-31',
    auditor: 'Intertek',
    score: 95,
    correctiveActions: []
  },
  {
    partner: 'Factory GHI',
    certification: 'SA8000',
    status: 'expired',
    expiryDate: '2024-02-28',
    auditor: 'BV',
    score: 78,
    correctiveActions: [
      { action: 'Renew certification', dueDate: '2024-03-15', status: 'in-progress' },
      { action: 'Address labor issues', dueDate: '2024-04-01', status: 'pending' }
    ]
  }
]

// Mock heatmap data
export const heatmapData = [
  { date: '2024-01-01', value: 45 },
  { date: '2024-01-02', value: 67 },
  { date: '2024-01-03', value: 23 },
  { date: '2024-01-04', value: 89 },
  { date: '2024-01-05', value: 156 },
  { date: '2024-01-06', value: 78 },
  { date: '2024-01-07', value: 134 },
  { date: '2024-01-08', value: 92 },
  { date: '2024-01-09', value: 45 },
  { date: '2024-01-10', value: 67 },
  { date: '2024-01-11', value: 23 },
  { date: '2024-01-12', value: 89 },
  { date: '2024-01-13', value: 156 },
  { date: '2024-01-14', value: 78 },
  { date: '2024-01-15', value: 134 },
  { date: '2024-01-16', value: 92 },
  { date: '2024-01-17', value: 45 },
  { date: '2024-01-18', value: 67 },
  { date: '2024-01-19', value: 23 },
  { date: '2024-01-20', value: 89 },
];

// Mock supplier data for search
export const mockSuppliers = [
  {
    id: 1,
    name: 'Shenzhen Textile Co.',
    country: 'China',
    city: 'Shenzhen',
    certifications: ['BSCI', 'WRAP', 'OEKO-TEX'],
    moq: 500,
    leadTime: 22,
    pricePerUnit: 6.42,
    rating: 4.8,
    productTypes: ['T-shirts', 'Activewear'],
    materials: ['Cotton', 'Polyester'],
    incoterm: 'FOB',
    paymentTerms: ['TT', 'LC'],
    supplierType: 'Factory',
  },
  {
    id: 2,
    name: 'Dhaka Garments Ltd.',
    country: 'Bangladesh',
    city: 'Dhaka',
    certifications: ['WRAP', 'GOTS'],
    moq: 1000,
    leadTime: 28,
    pricePerUnit: 4.85,
    rating: 4.6,
    productTypes: ['T-shirts', 'Knitwear'],
    materials: ['Cotton', 'Bamboo'],
    incoterm: 'FOB',
    paymentTerms: ['LC', 'Net 30'],
    supplierType: 'Factory',
  },
  {
    id: 3,
    name: 'Ho Chi Minh Textiles',
    country: 'Vietnam',
    city: 'Ho Chi Minh',
    certifications: ['BSCI', 'OEKO-TEX', 'ISO 9001'],
    moq: 300,
    leadTime: 20,
    pricePerUnit: 7.20,
    rating: 4.9,
    productTypes: ['Activewear', 'Outerwear'],
    materials: ['Polyester', 'Nylon'],
    incoterm: 'CIF',
    paymentTerms: ['TT', 'LC'],
    supplierType: 'Factory',
  },
  {
    id: 4,
    name: 'Mumbai Trading Co.',
    country: 'India',
    city: 'Mumbai',
    certifications: ['WRAP', 'SA8000'],
    moq: 800,
    leadTime: 25,
    pricePerUnit: 5.50,
    rating: 4.4,
    productTypes: ['Denim', 'T-shirts'],
    materials: ['Cotton', 'Elastane'],
    incoterm: 'FOB',
    paymentTerms: ['LC', 'Net 60'],
    supplierType: 'Trading Company',
  },
  {
    id: 5,
    name: 'Karachi Textile Mills',
    country: 'Pakistan',
    city: 'Karachi',
    certifications: ['BSCI'],
    moq: 1200,
    leadTime: 30,
    pricePerUnit: 4.20,
    rating: 4.2,
    productTypes: ['Knitwear', 'Socks'],
    materials: ['Cotton', 'Wool'],
    incoterm: 'EXW',
    paymentTerms: ['LC'],
    supplierType: 'Factory',
  },
  {
    id: 6,
    name: 'Istanbul Fashion Group',
    country: 'Turkey',
    city: 'Istanbul',
    certifications: ['OEKO-TEX', 'ISO 9001'],
    moq: 400,
    leadTime: 18,
    pricePerUnit: 8.50,
    rating: 4.7,
    productTypes: ['Outerwear', 'Accessories'],
    materials: ['Wool', 'Cotton'],
    incoterm: 'DDP',
    paymentTerms: ['TT', 'Net 30'],
    supplierType: 'Factory',
  },
  {
    id: 7,
    name: 'Guangzhou Apparel Co.',
    country: 'China',
    city: 'Guangzhou',
    certifications: ['BSCI', 'WRAP', 'GOTS'],
    moq: 600,
    leadTime: 24,
    pricePerUnit: 6.80,
    rating: 4.5,
    productTypes: ['T-shirts', 'Denim'],
    materials: ['Cotton', 'Polyester'],
    incoterm: 'FOB',
    paymentTerms: ['TT', 'LC'],
    supplierType: 'Factory',
  },
  {
    id: 8,
    name: 'Jakarta Textile Solutions',
    country: 'Indonesia',
    city: 'Jakarta',
    certifications: ['WRAP'],
    moq: 700,
    leadTime: 26,
    pricePerUnit: 5.90,
    rating: 4.3,
    productTypes: ['Activewear', 'Knitwear'],
    materials: ['Polyester', 'Nylon'],
    incoterm: 'FOB',
    paymentTerms: ['LC', 'Net 30'],
    supplierType: 'Trading Company',
  },
  {
    id: 9,
    name: 'Bangkok Fashion House',
    country: 'Thailand',
    city: 'Bangkok',
    certifications: ['BSCI', 'OEKO-TEX'],
    moq: 350,
    leadTime: 21,
    pricePerUnit: 7.50,
    rating: 4.6,
    productTypes: ['Outerwear', 'Accessories'],
    materials: ['Cotton', 'Bamboo'],
    incoterm: 'CIF',
    paymentTerms: ['TT', 'LC'],
    supplierType: 'Factory',
  },
  {
    id: 10,
    name: 'Manila Textile Corp.',
    country: 'Philippines',
    city: 'Manila',
    certifications: ['WRAP', 'SA8000'],
    moq: 900,
    leadTime: 27,
    pricePerUnit: 5.30,
    rating: 4.1,
    productTypes: ['T-shirts', 'Socks'],
    materials: ['Cotton', 'Elastane'],
    incoterm: 'FOB',
    paymentTerms: ['LC'],
    supplierType: 'Factory',
  },
];

// Filter options for search
export const filterOptions = {
  locations: [
    'China', 'Bangladesh', 'Vietnam', 'India', 'Pakistan', 
    'Turkey', 'Indonesia', 'Thailand', 'Philippines', 'Malaysia'
  ],
  productTypes: [
    'T-shirts', 'Knitwear', 'Denim', 'Socks', 'Activewear', 
    'Outerwear', 'Accessories', 'Underwear', 'Sportswear'
  ],
  materials: [
    'Cotton', 'Polyester', 'Nylon', 'Elastane', 'Wool', 
    'Bamboo', 'Modal', 'Viscose', 'Acrylic', 'Spandex'
  ],
  certifications: [
    'BSCI', 'WRAP', 'GOTS', 'OEKO-TEX', 'ISO 9001', 
    'SA8000', 'GRS', 'OCS', 'BCI'
  ],
  incoterms: ['FOB', 'EXW', 'DDP', 'CIF', 'DDU', 'CFR'],
  paymentTerms: ['TT', 'LC', 'Net 30', 'Net 60', 'Net 90', 'Alibaba Trade Assurance'],
  supplierTypes: ['Factory', 'Trading Company', 'Agent'],
};

// PO KPI data
export const poKPIs = {
  totalActive: 47,
  onTimePercentage: 89,
  delayedPercentage: 11,
  avgCycleTime: 28,
  pendingConfirmation: 8,
  avgFulfillment: 94
};
