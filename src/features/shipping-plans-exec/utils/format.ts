/**
 * Format money amount with currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted string like "1,250 USD"
 */
export function formatMoney(amount: number, currency: string = 'USD'): string {
  const formatted = amount.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return `${formatted} ${currency}`
}

