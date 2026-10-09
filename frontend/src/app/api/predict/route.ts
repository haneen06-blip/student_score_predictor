import { NextRequest, NextResponse } from 'next/server';
import { localPredictSingle } from '../../../lib/modelFallback';
import { StudentInput } from '../../../types';

export async function POST(req: NextRequest) {
  try {
    const body: StudentInput = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    // If external FastAPI backend is configured, try proxying first
    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (proxyErr) {
        // Fall back to serverless mathematical calculation
      }
    }

    // Direct verified native calculation
    const result = localPredictSingle(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process student prediction' },
      { status: 500 }
    );
  }
}
