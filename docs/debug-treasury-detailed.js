// COMPREHENSIVE StableAllowanceTreasury Deployment Debug
// Run this in browser console on /test-contract page

(async () => {
  const { createPublicClient, http, encodeAbiParameters, keccak256 } = await import('https://esm.sh/viem@2');
  const { baseSepolia } = await import('https://esm.sh/viem@2/chains');

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  console.log('🔍 COMPREHENSIVE StableAllowanceTreasury DEBUG');
  console.log('='.repeat(70));
  console.log('');

  const factoryAddress = '0xa44EbCC68383fc6761292A4D5Ec13127Cc123B56';
  const treasuryImpl = '0x86CCC5d79bF369FC38d2210138007b66D4Dd8433';
  const usdcAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
  const testOwner = '0x09A25B9f46F23371230B2070Cd42cBCb027Ca41B';
  const testRecipient = '0xd4145dfa61972968bEdF626D03A453f9A60de003';
  const testAllowance = BigInt(500_000_000); // 500 USDC

  // ========================================================================
  // STEP 1: Verify Implementation Contract Bytecode
  // ========================================================================
  console.log('STEP 1: Checking Implementation Contract Bytecode');
  console.log('-'.repeat(70));

  const implCode = await client.getBytecode({ address: treasuryImpl });
  console.log('Implementation has code:', implCode ? `✅ Yes (${implCode.length} chars)` : '❌ NO');

  if (!implCode || implCode === '0x') {
    console.error('❌ CRITICAL: Implementation contract has no bytecode!');
    console.log('The implementation was not deployed properly.');
    console.log('Check deployment tx:', `https://sepolia.basescan.org/address/${treasuryImpl}`);
    return;
  }
  console.log('');

  // ========================================================================
  // STEP 2: Check USDC Contract
  // ========================================================================
  console.log('STEP 2: Verifying USDC Contract');
  console.log('-'.repeat(70));

  const usdcCode = await client.getBytecode({ address: usdcAddress });
  console.log('USDC has code:', usdcCode ? `✅ Yes (${usdcCode.length} chars)` : '❌ NO');

  if (!usdcCode || usdcCode === '0x') {
    console.error('❌ CRITICAL: USDC contract not found!');
    console.log('This means the USDC address is wrong.');
    return;
  }

  // Try to read USDC decimals to verify it's a valid ERC20
  try {
    const decimals = await client.readContract({
      address: usdcAddress,
      abi: [{ type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' }],
      functionName: 'decimals',
    });
    console.log('USDC decimals:', decimals, decimals === 6 ? '✅' : '⚠️ Expected 6');
  } catch (e) {
    console.error('❌ Failed to read USDC decimals:', e.message);
  }
  console.log('');

  // ========================================================================
  // STEP 3: Check Factory Configuration
  // ========================================================================
  console.log('STEP 3: Verifying Factory Configuration');
  console.log('-'.repeat(70));

  const factoryUsdc = await client.readContract({
    address: factoryAddress,
    abi: [{ type: 'function', name: 'usdc', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'usdc',
  });
  console.log('Factory USDC:', factoryUsdc);
  console.log('Match:', factoryUsdc.toLowerCase() === usdcAddress.toLowerCase() ? '✅' : '❌');

  const factoryImpl = await client.readContract({
    address: factoryAddress,
    abi: [{ type: 'function', name: 'stableAllowanceTreasuryImpl', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'stableAllowanceTreasuryImpl',
  });
  console.log('Factory implementation:', factoryImpl);
  console.log('Match:', factoryImpl.toLowerCase() === treasuryImpl.toLowerCase() ? '✅' : '❌');
  console.log('');

  // ========================================================================
  // STEP 4: Test Different Allowance Amounts
  // ========================================================================
  console.log('STEP 4: Testing Different Allowance Amounts');
  console.log('-'.repeat(70));

  const testAmounts = [
    { label: 'Original (5 USDC)', value: BigInt(5_000_000) },
    { label: 'Medium (100 USDC)', value: BigInt(100_000_000) },
    { label: 'Large (500 USDC)', value: BigInt(500_000_000) },
    { label: 'Very Small (0.01 USDC)', value: BigInt(10_000) },
  ];

  for (const { label, value } of testAmounts) {
    try {
      console.log(`\nTesting ${label}...`);
      const result = await client.simulateContract({
        address: factoryAddress,
        abi: [{
          type: 'function',
          name: 'createStableAllowanceTreasury',
          inputs: [
            { name: '_owner', type: 'address' },
            { name: '_recipient', type: 'address' },
            { name: '_allowancePerIncrement', type: 'uint256' }
          ],
          outputs: [{ name: 'clone', type: 'address' }],
          stateMutability: 'nonpayable',
        }],
        functionName: 'createStableAllowanceTreasury',
        args: [testOwner, testRecipient, value],
        account: testOwner,
      });
      console.log(`  ✅ SUCCESS with ${label}!`);
      console.log(`  Predicted clone address: ${result.result}`);
    } catch (error) {
      console.log(`  ❌ FAILED with ${label}`);
      console.log(`  Error: ${error.message}`);

      // Try to extract revert reason
      if (error.cause?.data) {
        console.log(`  Raw error data: ${error.cause.data}`);
      }
    }
  }
  console.log('');

  // ========================================================================
  // STEP 5: Test Different Address Combinations
  // ========================================================================
  console.log('STEP 5: Testing Different Address Combinations');
  console.log('-'.repeat(70));

  const testAddresses = [
    {
      label: 'Original addresses',
      owner: '0x09A25B9f46F23371230B2070Cd42cBCb027Ca41B',
      recipient: '0xd4145dfa61972968bEdF626D03A453f9A60de003'
    },
    {
      label: 'Swapped addresses',
      owner: '0xd4145dfa61972968bEdF626D03A453f9A60de003',
      recipient: '0x09A25B9f46F23371230B2070Cd42cBCb027Ca41B'
    },
    {
      label: 'Fresh addresses (Vitalik as owner)',
      owner: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      recipient: testRecipient
    },
  ];

  for (const { label, owner, recipient } of testAddresses) {
    try {
      console.log(`\nTesting ${label}...`);
      console.log(`  Owner: ${owner}`);
      console.log(`  Recipient: ${recipient}`);

      const result = await client.simulateContract({
        address: factoryAddress,
        abi: [{
          type: 'function',
          name: 'createStableAllowanceTreasury',
          inputs: [
            { name: '_owner', type: 'address' },
            { name: '_recipient', type: 'address' },
            { name: '_allowancePerIncrement', type: 'uint256' }
          ],
          outputs: [{ name: 'clone', type: 'address' }],
          stateMutability: 'nonpayable',
        }],
        functionName: 'createStableAllowanceTreasury',
        args: [owner, recipient, testAllowance],
        account: testOwner,
      });
      console.log(`  ✅ SUCCESS!`);
      console.log(`  Predicted clone: ${result.result}`);
    } catch (error) {
      console.log(`  ❌ FAILED`);
      console.log(`  Error: ${error.message}`);
    }
  }
  console.log('');

  // ========================================================================
  // STEP 6: Check Gas Estimation
  // ========================================================================
  console.log('STEP 6: Gas Estimation Check');
  console.log('-'.repeat(70));

  try {
    const gasEstimate = await client.estimateContractGas({
      address: factoryAddress,
      abi: [{
        type: 'function',
        name: 'createStableAllowanceTreasury',
        inputs: [
          { name: '_owner', type: 'address' },
          { name: '_recipient', type: 'address' },
          { name: '_allowancePerIncrement', type: 'uint256' }
        ],
        outputs: [{ name: 'clone', type: 'address' }],
        stateMutability: 'nonpayable',
      }],
      functionName: 'createStableAllowanceTreasury',
      args: [testOwner, testRecipient, testAllowance],
      account: testOwner,
    });
    console.log('Estimated gas:', gasEstimate.toString());
    console.log('Gas is reasonable:', gasEstimate < 500000n ? '✅ Yes' : '⚠️ High gas');
  } catch (error) {
    console.error('❌ Gas estimation failed:', error.message);
    console.log('This confirms the transaction will revert');
  }
  console.log('');

  // ========================================================================
  // STEP 7: Try eth_call Directly
  // ========================================================================
  console.log('STEP 7: Direct eth_call Test');
  console.log('-'.repeat(70));

  try {
    // Encode the function call manually
    const functionSelector = keccak256('createStableAllowanceTreasury(address,address,uint256)').slice(0, 10);
    const encodedParams = encodeAbiParameters(
      [
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' }
      ],
      [testOwner, testRecipient, testAllowance]
    );
    const calldata = functionSelector + encodedParams.slice(2);

    console.log('Calldata:', calldata);

    const callResult = await client.call({
      to: factoryAddress,
      data: calldata,
      account: testOwner,
    });

    console.log('✅ eth_call succeeded!');
    console.log('Return data:', callResult.data);
  } catch (error) {
    console.error('❌ eth_call failed:', error.message);
    if (error.cause) {
      console.log('Error cause:', error.cause);
    }
  }
  console.log('');

  // ========================================================================
  // SUMMARY
  // ========================================================================
  console.log('='.repeat(70));
  console.log('🎯 DEBUG COMPLETE');
  console.log('='.repeat(70));
  console.log('');
  console.log('Next steps based on results above:');
  console.log('1. If all tests passed: The issue might be wallet-specific');
  console.log('2. If specific amount/address failed: We found the validation issue');
  console.log('3. If all tests failed: Implementation contract issue');
  console.log('4. Check BaseScan for implementation contract verification');
})();
