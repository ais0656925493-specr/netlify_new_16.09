import { NextRequest, NextResponse } from 'next/server'

import { resolveClientLocation } from '@/utils/resolveClientLocation'

export async function GET(req: NextRequest) {
  const hintedIp = new URL(req.url).searchParams.get('ip')
  const resolved = await resolveClientLocation(req, hintedIp)

  if (!resolved.ip) {
    return NextResponse.json(
      { error: 'Unable to resolve client IP' },
      { status: 404 },
    )
  }

  return NextResponse.json({
    status: 'success',
    query: resolved.ip,
    ip: resolved.ip,
    location: resolved.location,
    country_code: resolved.country_code,
    countryCode: resolved.country_code,
    timezone: resolved.timezone,
    device: resolved.device,
  })
}
