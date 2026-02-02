import { publicClient } from '@/config/blockchain'
import { RECURRING_RENT_ABI } from '@/lib/contracts/abis'
import type { Address } from 'viem'

export interface ContractState {
  landlord: Address
  tenant: Address
  monthlyAmount: bigint
  totalMonths: number
  startTime: bigint
  state: number
  terminationNoticeTime: bigint
}

/**
 * Read complete contract state from blockchain
 */
export async function readContractState(
  contractAddress: Address
): Promise<ContractState> {
  const [
    landlord,
    tenant,
    monthlyAmount,
    totalMonths,
    startTime,
    state,
    terminationNoticeTime,
  ] = await Promise.all([
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'landlord',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'tenant',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'monthlyAmount',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'totalMonths',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'startTime',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'state',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'terminationNoticeTime',
    }),
  ])

  return {
    landlord: landlord as Address,
    tenant: tenant as Address,
    monthlyAmount: monthlyAmount as bigint,
    totalMonths: Number(totalMonths),
    startTime: startTime as bigint,
    state: Number(state),
    terminationNoticeTime: terminationNoticeTime as bigint,
  }
}
