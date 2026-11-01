import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'success', message: 'OK', data: null });
}
