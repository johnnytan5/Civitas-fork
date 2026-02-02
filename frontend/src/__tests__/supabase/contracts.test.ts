import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import {
  createContract,
  getContractByAddress,
  getUserContracts,
  updateContract
} from '@/lib/supabase/contracts'
import { getOrCreateUser } from '@/lib/supabase/users'
import {
  generateTestWalletAddress,
  generateTestContractAddress,
  cleanupTestData
} from './setup'

describe('Supabase Contracts', () => {
  let testLandlordAddress: string
  let testTenantAddress: string
  let testContractAddress: string

  beforeEach(() => {
    testLandlordAddress = generateTestWalletAddress()
    testTenantAddress = generateTestWalletAddress()
    testContractAddress = generateTestContractAddress()
  })

  afterEach(async () => {
    await cleanupTestData(testLandlordAddress)
    await cleanupTestData(testTenantAddress)
  })

  it('should create a new contract', async () => {
    // Setup users
    await getOrCreateUser(testLandlordAddress)

    // Create contract
    const contract = await createContract({
      contract_address: testContractAddress,
      landlord_address: testLandlordAddress,
      tenant_address: testTenantAddress,
      monthly_amount: 1000000, // 1 USDC
      total_months: 12,
      state: 0,
    })

    expect(contract).toBeDefined()
    expect(contract.contract_address).toBe(testContractAddress)
    expect(contract.landlord_address).toBe(testLandlordAddress)
    expect(contract.monthly_amount).toBe(1000000)
  })

  it('should fetch contract by address', async () => {
    await getOrCreateUser(testLandlordAddress)
    await createContract({
      contract_address: testContractAddress,
      landlord_address: testLandlordAddress,
      monthly_amount: 1000000,
      total_months: 12,
      state: 0,
    })

    const fetched = await getContractByAddress(testContractAddress)
    expect(fetched).not.toBeNull()
    expect(fetched?.contract_address).toBe(testContractAddress)
  })

  it('should fetch user contracts', async () => {
    await getOrCreateUser(testLandlordAddress)
    await createContract({
      contract_address: testContractAddress,
      landlord_address: testLandlordAddress,
      monthly_amount: 1000000,
      total_months: 12,
      state: 0,
    })

    const contracts = await getUserContracts(testLandlordAddress)
    expect(contracts.length).toBeGreaterThan(0)
    expect(contracts[0].landlord_address).toBe(testLandlordAddress)
  })

  it('should update contract state', async () => {
    await getOrCreateUser(testLandlordAddress)
    await createContract({
      contract_address: testContractAddress,
      landlord_address: testLandlordAddress,
      monthly_amount: 1000000,
      total_months: 12,
      state: 0,
    })

    const updated = await updateContract(testContractAddress, {
      state: 1, // Active
      start_timestamp: Math.floor(Date.now() / 1000),
    })

    expect(updated.state).toBe(1)
    expect(updated.start_timestamp).toBeDefined()
  })
})
