import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect(process.env.NEXT_PUBLIC_GRAFANA_URL ?? 'http://localhost:3100/d/signal-lab/signal-lab-observability');
}
