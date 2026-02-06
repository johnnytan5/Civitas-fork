import { NextRequest, NextResponse } from 'next/server';
import { scanAndFindBestRoutes } from '@/lib/funding/routing';
import { z } from 'zod';

const requestSchema = z.object({
  walletAddress: z.string().min(42),
  destinationAddress: z.string().min(42),
  amount: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { walletAddress, destinationAddress, amount } = validation.data;

    // Scan wallet and find best routes
    const result = await scanAndFindBestRoutes(
      walletAddress,
      destinationAddress,
      amount
    );

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Funding route analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze routes' },
      { status: 500 }
    );
  }
}
