# Check CivitasFactory USDC Address

Run this in your browser console on the test page:

```javascript
// Check what USDC address the factory is using
const { createPublicClient, http } = await import('viem');
const { baseSepolia } = await import('viem/chains');

const client = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

const factoryAddress = '0xa44EbCC68383fc6761292A4D5Ec13127Cc123B56';

// Check USDC address
const usdcAddress = await client.readContract({
  address: factoryAddress,
  abi: [{
    type: 'function',
    name: 'usdc',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  }],
  functionName: 'usdc',
});

console.log('Factory USDC address:', usdcAddress);
console.log('Expected USDC address:', '0x036CbD53842c5426634e7929541eC2318f3dCF7e');
console.log('Match:', usdcAddress.toLowerCase() === '0x036CbD53842c5426634e7929541eC2318f3dCF7e'.toLowerCase());

// Check implementation addresses
const treasuryImpl = await client.readContract({
  address: factoryAddress,
  abi: [{
    type: 'function',
    name: 'stableAllowanceTreasuryImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  }],
  functionName: 'stableAllowanceTreasuryImpl',
});

console.log('Treasury Implementation:', treasuryImpl);
console.log('Expected:', '0x86CCC5d79bF369FC38d2210138007b66D4Dd8433');
console.log('Match:', treasuryImpl.toLowerCase() === '0x86CCC5d79bF369FC38d2210138007b66D4Dd8433'.toLowerCase());
```

This will tell us if the factory was deployed with the wrong addresses.
