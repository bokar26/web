/**
 * Resend email wrapper for RFQ emails
 * Uses Resend API (same pattern as Edge Function)
 */

export type RFQEmailDTO = {
  to: string
  providerName: string
  shipmentIds: string[]
  shipmentDetails: Array<{
    id: string
    origin: string
    destination: string
    plannedEta: string | null
  }>
  responseDue?: string
}

/**
 * Send RFQ email via Resend
 */
export async function sendRFQEmail(dto: RFQEmailDTO): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.log('Resend API key not configured, skipping email')
    return
  }

  const emailSubject = `RFQ Request - ${dto.shipmentIds.length} Shipment${dto.shipmentIds.length > 1 ? 's' : ''}`
  
  const shipmentList = dto.shipmentDetails
    .map((s) => `- ${s.origin} → ${s.destination} (ETA: ${s.plannedEta || 'TBD'})`)
    .join('\n')

  const emailBody = `
Dear ${dto.providerName},

We are requesting a quote for the following shipment${dto.shipmentIds.length > 1 ? 's' : ''}:

${shipmentList}

${dto.responseDue ? `Please respond by ${new Date(dto.responseDue).toLocaleDateString()}.` : 'Please respond at your earliest convenience.'}

Thank you,
SLA Team
  `.trim()

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'SLA <noreply@sla.com>', // TODO: Update with actual sender
        to: dto.to,
        subject: emailSubject,
        text: emailBody,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to send RFQ email:', error)
      throw new Error(`Failed to send email: ${error.message || response.statusText}`)
    }
  } catch (error) {
    console.error('Error sending RFQ email:', error)
    throw error
  }
}

