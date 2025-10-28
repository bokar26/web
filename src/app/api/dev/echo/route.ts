import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Guard: dev-only
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Echo back with mock scheduleUrl
    return NextResponse.json({
      ok: true,
      scheduleUrl: `https://cal.com/test?name=${encodeURIComponent(body.full_name || 'Guest')}&email=${encodeURIComponent(body.work_email || '')}`,
      receivedData: body,
      note: 'DEV MODE: This is a mock response'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    )
  }
}

