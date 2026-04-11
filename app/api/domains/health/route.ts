import { NextResponse } from 'next/server';
import { verifyNamecomCredentials } from '@/lib/domains/namecom';

export const dynamic = 'force-dynamic';

/** Health check — confirms Name.com credentials are working */
export async function GET() {
  try {
    const ok = await verifyNamecomCredentials();
    return NextResponse.json({
      status:    ok ? 'ok' : 'degraded',
      namecom:   ok ? 'connected' : 'unreachable',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      status:    'error',
      namecom:   'misconfigured',
      error:     err.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
