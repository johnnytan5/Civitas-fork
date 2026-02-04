import { NextRequest, NextResponse } from 'next/server';
import { updateGenericContract } from '@/lib/supabase/generic-contracts';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { contract_address, basename } = body;

    if (!contract_address) {
      return NextResponse.json(
        { error: 'Missing contract_address' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (basename !== undefined) {
      updates.basename = basename;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const contract = await updateGenericContract(contract_address, updates);

    return NextResponse.json({
      success: true,
      contract,
    });
  } catch (error: any) {
    console.error('Failed to update contract:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update contract' },
      { status: 500 }
    );
  }
}
