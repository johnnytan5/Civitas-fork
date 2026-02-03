import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const normalizedAddress = address.toLowerCase();

    // Step 1: Check contract_participants table directly
    const { data: participantRecords, error: participantError } = await supabase
      .from('contract_participants')
      .select('*')
      .eq('user_address', normalizedAddress);

    console.log('🔍 Step 1 - Participant records:', participantRecords);
    console.log('❌ Participant error:', participantError);

    // Step 2: Check contracts table for those contract_ids
    let contractRecords = null;
    if (participantRecords && participantRecords.length > 0) {
      const contractIds = participantRecords.map(p => p.contract_id);
      const { data: contracts, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .in('id', contractIds);

      contractRecords = contracts;
      console.log('🔍 Step 2 - Contract records:', contracts);
      console.log('❌ Contract error:', contractError);
    }

    // Step 3: Try the join query (what we use in production)
    const { data: joinData, error: joinError } = await supabase
      .from('contracts')
      .select(`
        *,
        contract_participants!inner(user_address, role, share_bps)
      `)
      .eq('contract_participants.user_address', normalizedAddress)
      .order('created_at', { ascending: false });

    console.log('🔍 Step 3 - Join query result:', joinData);
    console.log('❌ Join error:', joinError);

    // Step 4: Check for the specific contract address
    const { data: specificContract, error: specificError } = await supabase
      .from('contracts')
      .select('*')
      .eq('contract_address', '0xd3A9E1754ecBa68859186d8e5dc25e6564672DC6')
      .single();

    console.log('🔍 Step 4 - Specific contract:', specificContract);
    console.log('❌ Specific contract error:', specificError);

    return NextResponse.json({
      debug: true,
      address: address,
      normalizedAddress: normalizedAddress,
      step1_participantRecords: {
        count: participantRecords?.length || 0,
        data: participantRecords,
        error: participantError?.message,
      },
      step2_contractRecords: {
        count: contractRecords?.length || 0,
        data: contractRecords,
      },
      step3_joinQuery: {
        count: joinData?.length || 0,
        data: joinData,
        error: joinError?.message,
      },
      step4_specificContract: {
        found: !!specificContract,
        data: specificContract,
        error: specificError?.message,
      },
    });
  } catch (error: any) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
