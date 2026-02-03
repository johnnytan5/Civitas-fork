// Comprehensive StableAllowanceTreasury Debug Script
// Run this in browser console on the test-contract page

(async () => {
  const { createPublicClient, http, decodeErrorResult } = await import('https://esm.sh/viem@2');
  const { baseSepolia } = await import('https://esm.sh/viem@2/chains');

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  console.log('🔍 DEBUGGING StableAllowanceTreasury Deployment');
  console.log('='.repeat(60));
  console.log('');

  const factoryAddress = '0xa44EbCC68383fc6761292A4D5Ec13127Cc123B56';
  const treasuryImpl = '0x86CCC5d79bF369FC38d2210138007b66D4Dd8433';
  const usdcAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

  // Step 1: Check if implementation contract exists
  console.log('Step 1: Checking implementation contract...');
  const implCode = await client.getBytecode({ address: treasuryImpl });
  console.log('✅ Implementation exists:', implCode ? `Yes (${implCode.length} bytes)` : '❌ NO CODE FOUND!');

  if (!implCode) {
    console.error('❌ CRITICAL: Implementation contract has no code!');
    console.log('This means the contract was not deployed or deployment failed');
    console.log('Check deployment transaction:', 'https://sepolia.basescan.org/address/' + treasuryImpl);
    return;
  }
  console.log('');

  // Step 2: Check factory has correct implementation address
  console.log('Step 2: Verifying factory configuration...');
  const factoryImplAddr = await client.readContract({
    address: factoryAddress,
    abi: [{ type: 'function', name: 'stableAllowanceTreasuryImpl', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'stableAllowanceTreasuryImpl',
  });
  console.log('Factory implementation address:', factoryImplAddr);
  console.log('Match:', factoryImplAddr.toLowerCase() === treasuryImpl.toLowerCase() ? '✅ YES' : '❌ NO');
  console.log('');

  // Step 3: Try to predict the clone address
  console.log('Step 3: Testing clone creation...');
  try {
    const userAddress = '0x09A25B9f46F23371230B2070Cd42cBCb027Ca41B';

    // Try to simulate just the clone creation part
    const simulateResult = await client.simulateContract({
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
      args: [userAddress, userAddress, BigInt(5000000)],
      account: userAddress,
    });

    console.log('✅ Simulation passed!', simulateResult);
  } catch (error) {
    console.error('❌ Simulation failed!');
    console.error('Error:', error.message);
    console.log('');

    // Step 4: Try to get more details about the error
    console.log('Step 4: Analyzing the revert...');

    try {
      // Try calling with eth_call to get revert reason
      const callResult = await client.call({
        to: factoryAddress,
        data: '0x...' // We'd need to encode this properly
      });
      console.log('Call result:', callResult);
    } catch (callError) {
      console.log('Call error:', callError);
    }
  }
  console.log('');

  // Step 5: Check if USDC address is correct
  console.log('Step 5: Checking USDC configuration...');
  const factoryUsdc = await client.readContract({
    address: factoryAddress,
    abi: [{ type: 'function', name: 'usdc', inputs: [], outputs: [{ type: 'address' }], stateMutability: 'view' }],
    functionName: 'usdc',
  });
  console.log('Factory USDC:', factoryUsdc);
  console.log('Expected USDC:', usdcAddress);
  console.log('Match:', factoryUsdc.toLowerCase() === usdcAddress.toLowerCase() ? '✅ YES' : '❌ NO');
  console.log('');

  // Step 6: Check USDC contract exists
  console.log('Step 6: Checking USDC contract...');
  const usdcCode = await client.getBytecode({ address: usdcAddress });
  console.log('USDC exists:', usdcCode ? `✅ Yes (${usdcCode.length} bytes)` : '❌ NO CODE!');
  console.log('');

  // Step 7: Manual check - can we call the implementation directly?
  console.log('Step 7: Testing implementation contract directly...');
  try {
    // Try to read any public function from the implementation
    const testCall = await client.readContract({
      address: treasuryImpl,
      abi: [{
        type: 'function',
        name: 'USDC',
        inputs: [],
        outputs: [{ type: 'address' }],
        stateMutability: 'view'
      }],
      functionName: 'USDC',
    });
    console.log('Implementation USDC address:', testCall);
  } catch (e) {
    console.log('Could not read from implementation (expected for uninitialized clone template)');
  }
  console.log('');

  console.log('='.repeat(60));
  console.log('🎯 DIAGNOSIS COMPLETE');
  console.log('='.repeat(60));
  console.log('');
  console.log('Next steps:');
  console.log('1. Check implementation bytecode on BaseScan:');
  console.log('   ' + 'https://sepolia.basescan.org/address/' + treasuryImpl + '#code');
  console.log('2. Verify the contract is verified on BaseScan');
  console.log('3. Check the deployment transaction for the implementation');
})();
