/**
 * Document content generation for ASN, CI, PL
 * Generates simple HTML placeholder documents
 */

import type { Shipment } from '../types'

/**
 * Generate HTML content for ASN (Advanced Shipping Notice)
 */
function generateASNContent(shipment: Shipment): string {
  const containers = shipment.containers || []
  const items: Array<{ sku: string; qty: number; container?: string }> = []

  // Collect items from container_items
  containers.forEach((container) => {
    const containerItems = container.items || []
    containerItems.forEach((item) => {
      items.push({
        sku: item.sku_id || 'UNKNOWN',
        qty: item.quantity || 0,
        container: container.container_number || container.id.slice(0, 8),
      })
    })
  })

  // If no container items, use allocations
  if (items.length === 0 && shipment.allocations) {
    shipment.allocations.forEach((alloc) => {
      items.push({
        sku: alloc.sku_id || 'UNKNOWN',
        qty: alloc.quantity_reserved || 0,
      })
    })
  }

  const etd = shipment.legs?.[0]?.planned_departure || shipment.planned_eta
  const eta = shipment.planned_eta

  return `<!DOCTYPE html>
<html>
<head>
  <title>ASN - ${shipment.id.slice(0, 8)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Advanced Shipping Notice</h1>
  <p><strong>Shipment ID:</strong> ${shipment.id}</p>
  <p><strong>Origin:</strong> ${shipment.origin_port_id || 'N/A'}</p>
  <p><strong>Destination:</strong> ${shipment.dest_port_id || 'N/A'}</p>
  <p><strong>ETD:</strong> ${etd ? new Date(etd).toLocaleDateString() : 'N/A'}</p>
  <p><strong>ETA:</strong> ${eta ? new Date(eta).toLocaleDateString() : 'N/A'}</p>
  
  <h2>Containers</h2>
  <table>
    <tr>
      <th>Container ID</th>
      <th>Type</th>
      <th>Status</th>
    </tr>
    ${containers.map((c) => `
    <tr>
      <td>${c.container_number || c.id.slice(0, 8)}</td>
      <td>${c.container_type || 'N/A'}</td>
      <td>${c.status || 'N/A'}</td>
    </tr>
    `).join('')}
  </table>

  <h2>Items</h2>
  <table>
    <tr>
      <th>SKU</th>
      <th>Quantity</th>
      <th>Container</th>
    </tr>
    ${items.map((item) => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.qty}</td>
      <td>${item.container || 'N/A'}</td>
    </tr>
    `).join('')}
  </table>
</body>
</html>`
}

/**
 * Generate HTML content for CI (Commercial Invoice)
 */
function generateCIContent(shipment: Shipment): string {
  const invoiceNumber = `INV-${shipment.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  const items: Array<{ sku: string; qty: number; value: number }> = []

  // Collect items from allocations or container_items
  if (shipment.allocations && shipment.allocations.length > 0) {
    shipment.allocations.forEach((alloc) => {
      // Placeholder value calculation (in production, would use actual SKU pricing)
      const unitValue = 10 // Placeholder
      items.push({
        sku: alloc.sku_id || 'UNKNOWN',
        qty: alloc.quantity_reserved || 0,
        value: (alloc.quantity_reserved || 0) * unitValue,
      })
    })
  } else if (shipment.containers) {
    shipment.containers.forEach((container) => {
      const containerItems = container.items || []
      containerItems.forEach((item) => {
        const unitValue = 10 // Placeholder
        items.push({
          sku: item.sku_id || 'UNKNOWN',
          qty: item.quantity || 0,
          value: (item.quantity || 0) * unitValue,
        })
      })
    })
  }

  const totalValue = items.reduce((sum, item) => sum + item.value, 0)

  return `<!DOCTYPE html>
<html>
<head>
  <title>Commercial Invoice - ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Commercial Invoice</h1>
  <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
  <p><strong>Shipment ID:</strong> ${shipment.id}</p>
  <p><strong>Seller:</strong> [Company Name]</p>
  <p><strong>Buyer:</strong> [Buyer Name]</p>
  <p><strong>Incoterm:</strong> FOB</p>
  <p><strong>Currency:</strong> USD</p>
  
  <h2>Line Items</h2>
  <table>
    <tr>
      <th>SKU</th>
      <th>Quantity</th>
      <th>Unit Value (USD)</th>
      <th>Total Value (USD)</th>
    </tr>
    ${items.map((item) => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.qty}</td>
      <td>$${10.00.toFixed(2)}</td>
      <td>$${item.value.toFixed(2)}</td>
    </tr>
    `).join('')}
  </table>

  <div class="total">
    <p><strong>Total Invoice Value:</strong> $${totalValue.toFixed(2)} USD</p>
  </div>
</body>
</html>`
}

/**
 * Generate HTML content for PL (Packing List)
 */
function generatePLContent(shipment: Shipment): string {
  const containers = shipment.containers || []
  const items: Array<{ sku: string; qty: number; weight: number; volume: number; container?: string }> = []

  // Collect items from container_items
  containers.forEach((container) => {
    const containerItems = container.items || []
    containerItems.forEach((item) => {
      items.push({
        sku: item.sku_id || 'UNKNOWN',
        qty: item.quantity || 0,
        weight: item.weight_kg || 0,
        volume: item.volume_cbm || 0,
        container: container.container_number || container.id.slice(0, 8),
      })
    })
  })

  // If no container items, use allocations
  if (items.length === 0 && shipment.allocations) {
    shipment.allocations.forEach((alloc) => {
      items.push({
        sku: alloc.sku_id || 'UNKNOWN',
        qty: alloc.quantity_reserved || 0,
        weight: 0,
        volume: 0,
      })
    })
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  const totalVolume = items.reduce((sum, item) => sum + item.volume, 0)

  return `<!DOCTYPE html>
<html>
<head>
  <title>Packing List - ${shipment.id.slice(0, 8)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .summary { margin-top: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Packing List</h1>
  <p><strong>Shipment ID:</strong> ${shipment.id}</p>
  <p><strong>Origin:</strong> ${shipment.origin_port_id || 'N/A'}</p>
  <p><strong>Destination:</strong> ${shipment.dest_port_id || 'N/A'}</p>
  
  <h2>Packages/Containers</h2>
  <table>
    <tr>
      <th>Container ID</th>
      <th>Type</th>
      <th>Status</th>
      <th>Utilization %</th>
    </tr>
    ${containers.map((c) => `
    <tr>
      <td>${c.container_number || c.id.slice(0, 8)}</td>
      <td>${c.container_type || 'N/A'}</td>
      <td>${c.status || 'N/A'}</td>
      <td>${c.utilization_pct?.toFixed(1) || '0'}%</td>
    </tr>
    `).join('')}
  </table>

  <h2>Items</h2>
  <table>
    <tr>
      <th>SKU</th>
      <th>Quantity</th>
      <th>Weight (kg)</th>
      <th>Volume (cbm)</th>
      <th>Container</th>
    </tr>
    ${items.map((item) => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.qty}</td>
      <td>${item.weight.toFixed(2)}</td>
      <td>${item.volume.toFixed(3)}</td>
      <td>${item.container || 'N/A'}</td>
    </tr>
    `).join('')}
  </table>

  <div class="summary">
    <p><strong>Total Weight:</strong> ${totalWeight.toFixed(2)} kg</p>
    <p><strong>Total Volume:</strong> ${totalVolume.toFixed(3)} cbm</p>
  </div>
</body>
</html>`
}

/**
 * Generate document content based on type
 */
export function generateDocumentContent(
  shipment: Shipment,
  type: 'ASN' | 'CI' | 'PL'
): string {
  switch (type) {
    case 'ASN':
      return generateASNContent(shipment)
    case 'CI':
      return generateCIContent(shipment)
    case 'PL':
      return generatePLContent(shipment)
    default:
      throw new Error(`Unknown document type: ${type}`)
  }
}

