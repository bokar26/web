// Mock data generators for search entities
import { Supplier, Factory, Warehouse, FreightForwarder, Carrier } from '@/types/search'

// Helper function to generate random IDs
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`

// Helper function to pick random items from array
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Helper function to pick multiple random items
const randomPickMultiple = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Common data pools
const countries = ['China', 'India', 'Bangladesh', 'Vietnam', 'Indonesia', 'Pakistan', 'Turkey', 'Mexico', 'Brazil', 'Thailand']
const regions = ['Asia Pacific', 'South Asia', 'Southeast Asia', 'Middle East', 'North America', 'South America', 'Europe']
const certifications = ['ISO 9001', 'ISO 14001', 'WRAP', 'BSCI', 'SA8000', 'OEKO-TEX', 'GOTS', 'Fair Trade']
const specialties = ['Cotton', 'Polyester', 'Denim', 'Athletic Wear', 'Formal Wear', 'Children\'s Clothing', 'Outerwear', 'Accessories']
const modes = ['Air', 'Sea', 'Land', 'Rail', 'Truck']
const services = ['3PL', 'Cold Storage', 'Hazardous Materials', 'Cross-docking', 'Pick & Pack', 'Fulfillment', 'Returns Processing']

// Generate realistic supplier data
export function generateSuppliers(count: number): Supplier[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId('supplier'),
    name: `Supplier ${i + 1} ${randomPick(['Textiles', 'Garments', 'Manufacturing', 'Trading', 'Sourcing'])}`,
    country: randomPick(countries),
    region: randomPick(regions),
    onTimePercent: Math.round(Math.random() * 20 + 80), // 80-100%
    defectRate: Math.round(Math.random() * 5 + 0.5) / 100, // 0.5-5.5%
    avgLeadTimeDays: Math.round(Math.random() * 30 + 15), // 15-45 days
    riskIndex: Math.round(Math.random() * 5 + 1), // 1-5
    certifications: randomPickMultiple(certifications, Math.floor(Math.random() * 4) + 1),
    moq: Math.round(Math.random() * 5000 + 500), // 500-5500 units
    minOrderValue: Math.round(Math.random() * 50000 + 10000), // $10k-$60k
    lastOrderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalOrders: Math.round(Math.random() * 200 + 10),
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
    specialties: randomPickMultiple(specialties, Math.floor(Math.random() * 3) + 1),
    contactEmail: `contact${i + 1}@supplier${i + 1}.com`,
    website: Math.random() > 0.3 ? `https://supplier${i + 1}.com` : undefined,
  }))
}

// Generate realistic factory data
export function generateFactories(count: number): Factory[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId('factory'),
    name: `Factory ${i + 1} ${randomPick(['Manufacturing', 'Textiles', 'Garments', 'Production', 'Workshop'])}`,
    country: randomPick(countries),
    region: randomPick(regions),
    capabilities: randomPickMultiple(specialties, Math.floor(Math.random() * 4) + 2),
    capacity: Math.round(Math.random() * 100000 + 10000), // 10k-110k units/month
    utilization: Math.round(Math.random() * 40 + 60), // 60-100%
    certifications: randomPickMultiple(certifications, Math.floor(Math.random() * 3) + 1),
    complianceScore: Math.round(Math.random() * 20 + 80), // 80-100
    avgLeadTimeDays: Math.round(Math.random() * 25 + 20), // 20-45 days
    defectRate: Math.round(Math.random() * 3 + 0.5) / 100, // 0.5-3.5%
    moq: Math.round(Math.random() * 3000 + 1000), // 1k-4k units
    specialties: randomPickMultiple(specialties, Math.floor(Math.random() * 3) + 1),
    establishedYear: Math.round(Math.random() * 30 + 1990), // 1990-2020
    employeeCount: Math.round(Math.random() * 500 + 50), // 50-550 employees
    contactEmail: `info${i + 1}@factory${i + 1}.com`,
    website: Math.random() > 0.4 ? `https://factory${i + 1}.com` : undefined,
  }))
}

// Generate realistic warehouse data
export function generateWarehouses(count: number): Warehouse[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId('warehouse'),
    name: `Warehouse ${i + 1} ${randomPick(['Distribution', 'Logistics', 'Storage', 'Fulfillment', 'Hub'])}`,
    country: randomPick(countries),
    region: randomPick(regions),
    city: `City ${i + 1}`,
    capacity: Math.round(Math.random() * 50000 + 5000), // 5k-55k sq ft
    utilization: Math.round(Math.random() * 30 + 70), // 70-100%
    slaPickRate: Math.round(Math.random() * 10 + 90), // 90-100%
    slaPackRate: Math.round(Math.random() * 10 + 90), // 90-100%
    inboundVolume: Math.round(Math.random() * 10000 + 1000), // 1k-11k units/month
    outboundVolume: Math.round(Math.random() * 10000 + 1000), // 1k-11k units/month
    services: randomPickMultiple(services, Math.floor(Math.random() * 4) + 2),
    certifications: randomPickMultiple(certifications, Math.floor(Math.random() * 3) + 1),
    temperatureControlled: Math.random() > 0.7,
    hazardousMaterials: Math.random() > 0.8,
    lastAuditDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contactEmail: `warehouse${i + 1}@logistics.com`,
    website: Math.random() > 0.5 ? `https://warehouse${i + 1}.com` : undefined,
  }))
}

// Generate realistic freight forwarder data
export function generateForwarders(count: number): FreightForwarder[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId('forwarder'),
    name: `Forwarder ${i + 1} ${randomPick(['Logistics', 'Shipping', 'Freight', 'Transport', 'Cargo'])}`,
    country: randomPick(countries),
    region: randomPick(regions),
    lanes: randomPickMultiple([
      'Shanghai-Los Angeles',
      'Shenzhen-New York',
      'Hong Kong-Chicago',
      'Guangzhou-Miami',
      'Ningbo-Houston',
      'Tianjin-Seattle',
      'Qingdao-Long Beach',
      'Xiamen-Savannah'
    ], Math.floor(Math.random() * 5) + 3),
    avgTransitVariance: Math.round(Math.random() * 5 + 1), // 1-6 days
    quoteResponsiveness: Math.round(Math.random() * 20 + 80), // 80-100%
    serviceRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
    modes: randomPickMultiple(modes, Math.floor(Math.random() * 3) + 2),
    specialties: randomPickMultiple(specialties, Math.floor(Math.random() * 3) + 1),
    certifications: randomPickMultiple(certifications, Math.floor(Math.random() * 3) + 1),
    establishedYear: Math.round(Math.random() * 25 + 1995), // 1995-2020
    totalShipments: Math.round(Math.random() * 10000 + 1000), // 1k-11k shipments
    onTimePercent: Math.round(Math.random() * 15 + 85), // 85-100%
    contactEmail: `forwarder${i + 1}@shipping.com`,
    website: Math.random() > 0.3 ? `https://forwarder${i + 1}.com` : undefined,
  }))
}

// Generate realistic carrier data
export function generateCarriers(count: number): Carrier[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId('carrier'),
    name: `Carrier ${i + 1} ${randomPick(['Express', 'Logistics', 'Transport', 'Shipping', 'Delivery'])}`,
    country: randomPick(countries),
    region: randomPick(regions),
    modes: randomPickMultiple(modes, Math.floor(Math.random() * 2) + 1),
    lanes: randomPickMultiple([
      'Domestic US',
      'US-Canada',
      'US-Mexico',
      'Trans-Pacific',
      'Trans-Atlantic',
      'Intra-Asia',
      'Europe-Asia',
      'Middle East-Asia'
    ], Math.floor(Math.random() * 4) + 2),
    onTimePercent: Math.round(Math.random() * 15 + 85), // 85-100%
    claimsRate: Math.round(Math.random() * 2 + 0.5) / 100, // 0.5-2.5%
    costPerMile: Math.round(Math.random() * 3 + 1) / 10, // $0.1-$0.4 per mile
    serviceLevel: randomPick(['Standard', 'Express', 'Priority', 'Economy', 'Premium']),
    specialties: randomPickMultiple(specialties, Math.floor(Math.random() * 3) + 1),
    certifications: randomPickMultiple(certifications, Math.floor(Math.random() * 3) + 1),
    fleetSize: Math.round(Math.random() * 500 + 50), // 50-550 vehicles
    establishedYear: Math.round(Math.random() * 30 + 1990), // 1990-2020
    contactEmail: `carrier${i + 1}@transport.com`,
    website: Math.random() > 0.2 ? `https://carrier${i + 1}.com` : undefined,
  }))
}

// Export sample datasets
export const sampleSuppliers = generateSuppliers(50)
export const sampleFactories = generateFactories(40)
export const sampleWarehouses = generateWarehouses(30)
export const sampleForwarders = generateForwarders(25)
export const sampleCarriers = generateCarriers(35)

// Export all sample data
export const sampleSearchData = {
  suppliers: sampleSuppliers,
  factories: sampleFactories,
  warehouses: sampleWarehouses,
  forwarders: sampleForwarders,
  carriers: sampleCarriers,
}
