// KPI metrics for dashboard
export const kpis = {
  ccc: { 
    title: 'Cash Conversion Cycle', 
    value: 66, 
    unit: 'days', 
    deltaPct: -4.1, 
    trend: 'down' as const 
  },
  landed: { 
    title: 'Avg Landed Cost / unit', 
    value: 6.42, 
    unit: 'USD', 
    deltaPct: -8.1, 
    trend: 'down' as const 
  },
  ship: { 
    title: 'Avg Shipping Time', 
    value: 25, 
    unit: 'days', 
    deltaPct: -10.7, 
    trend: 'down' as const 
  },
  otd: { 
    title: 'On-Time Delivery', 
    value: 96, 
    unit: '%', 
    deltaPct: 3.1, 
    trend: 'up' as const 
  },
};

// Weekly trend data for charts
export const cccTrendData = [
  { week: 'W1', value: 72 },
  { week: 'W2', value: 70 },
  { week: 'W3', value: 68 },
  { week: 'W4', value: 69 },
  { week: 'W5', value: 67 },
  { week: 'W6', value: 66 },
  { week: 'W7', value: 65 },
  { week: 'W8', value: 66 },
  { week: 'W9', value: 64 },
  { week: 'W10', value: 63 },
  { week: 'W11', value: 65 },
  { week: 'W12', value: 66 },
];

export const shipTimeTrendData = [
  { week: 'W1', value: 28 },
  { week: 'W2', value: 27 },
  { week: 'W3', value: 26 },
  { week: 'W4', value: 25 },
  { week: 'W5', value: 24 },
  { week: 'W6', value: 25 },
  { week: 'W7', value: 24 },
  { week: 'W8', value: 23 },
  { week: 'W9', value: 24 },
  { week: 'W10', value: 25 },
  { week: 'W11', value: 24 },
  { week: 'W12', value: 25 },
];

// Additional dashboard metrics
export const additionalMetrics = {
  totalRevenue: { value: 265000, period: 'last 30 days' },
  commission: { value: 68375, period: 'last 30 days' },
  openOrders: { value: 4, label: 'live' },
  timeSaved: { value: 12, unit: 'h', period: '30-day total' },
};

// Goal tracking
export const currentGoal = {
  title: 'Increase Q4 shipping speed by 18%',
  progress: 6,
  target: 18,
  percentOfGoal: 33,
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
