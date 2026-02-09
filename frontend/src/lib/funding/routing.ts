import { createPublicClient, http, isAddress as viemIsAddress, formatUnits, parseUnits } from 'viem';
import { base, baseSepolia, mainnet, arbitrum, optimism, polygon } from 'viem/chains';
import { USDC_ADDRESS } from '@/lib/contracts/constants';

// Minimal ERC20 ABI for checking balances
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

// Token configuration for balance scanning
export const CHAIN_TOKENS = [
  {
    chain: mainnet,
    name: 'Ethereum Mainnet',
    tokens: [
      { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 }
    ]
  },
  {
    chain: base,
    name: 'Base',
    tokens: [
      { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', address: USDC_ADDRESS[base.id], decimals: 6 }
    ]
  },
  {
    chain: arbitrum,
    name: 'Arbitrum',
    tokens: [
      { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 }
    ]
  },
  {
    chain: optimism,
    name: 'Optimism',
    tokens: [
      { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', address: '0x0b2C639c53A9AD698533B4384aC2604035C125dB', decimals: 6 }
    ]
  },
  {
    chain: polygon,
    name: 'Polygon',
    tokens: [
      { symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 }
    ]
  },
];

export interface TokenBalance {
  symbol: string;
  tokenAddress: string;
  amount: string;
  amountRaw: string;
  decimals: number;
}

export interface ChainBalanceResult {
  chainId: number;
  chainName: string;
  balances: TokenBalance[];
}

export interface Route {
  sourceChainId: number;
  sourceToken: string;
  sourceTokenAddress: string;
  gasCostUsd: string;
  executionDuration: number;
  tool: string;
  steps: number;
  action?: any;
  isDirect?: boolean; // Flag for direct transfer (no bridge)
}

export interface ScanResult {
  address: string;
  balances: ChainBalanceResult[];
  totalChainsFound: number;
}

export interface RouteAnalysisResult {
  routes: Route[];
  recommendation: {
    bestRoute: Route;
    reason: string;
  };
}

export interface ScanProgress {
  step: 'wallet' | 'routes' | 'comparing';
  message: string;
  chainsScanned?: number;
  tokensFound?: number;
  routesCalculated?: number;
}

/**
 * Scan a wallet address across multiple chains to find ETH and USDC balances
 */
export async function scanWalletBalances(address: string): Promise<ScanResult | null> {
  console.log(`[scanWalletBalances] Starting scan for address: ${address}`);

  if (!viemIsAddress(address)) {
    console.error(`[scanWalletBalances] Invalid address format: ${address}`);
    throw new Error('Invalid address format');
  }

  const results = await Promise.all(
    CHAIN_TOKENS.map(async (chainConfig) => {
      try {
        const client = createPublicClient({
          chain: chainConfig.chain,
          transport: http(),
        });

        const balances = await Promise.all(
          chainConfig.tokens.map(async (token) => {
            try {
              let balance: bigint;
              if (token.address === '0x0000000000000000000000000000000000000000') {
                balance = await client.getBalance({ address: address as `0x${string}` });
              } else {
                balance = await client.readContract({
                  address: token.address as `0x${string}`,
                  abi: ERC20_ABI,
                  functionName: 'balanceOf',
                  args: [address as `0x${string}`],
                });
              }

              const formatted = formatUnits(balance, token.decimals);

              // Filter out dust (< 0.0001)
              if (parseFloat(formatted) < 0.0001) {
                return null;
              }

              return {
                symbol: token.symbol,
                tokenAddress: token.address,
                amount: formatted,
                amountRaw: balance.toString(),
                decimals: token.decimals,
              };
            } catch (e: any) {
              console.error(`[scanWalletBalances] Error fetching ${token.symbol} on ${chainConfig.name}:`, e.message);
              return null;
            }
          })
        );

        const activeBalances = balances.filter((b): b is TokenBalance => b !== null);

        if (activeBalances.length === 0) return null;

        return {
          chainId: chainConfig.chain.id,
          chainName: chainConfig.name,
          balances: activeBalances,
        };
      } catch (e: any) {
        console.error(`[scanWalletBalances] Failed to scan chain ${chainConfig.name}:`, e.message);
        return null;
      }
    })
  );

  const foundFunds = results.filter((r) => r !== null) as ChainBalanceResult[];

  return {
    address,
    balances: foundFunds,
    totalChainsFound: foundFunds.length,
  };
}

export interface CandidateToken {
  chainId: number;
  tokenAddress: string;
  symbol: string;
}

/**
 * Calculate and compare optimal routes to fund a contract on Base
 */
export async function getOptimalFundingRoutes(
  walletAddress: string,
  destinationAddress: string,
  amount: string,
  candidateTokens: CandidateToken[]
): Promise<RouteAnalysisResult | null> {
  try {
    const routes = await Promise.all(
      candidateTokens.map(async (candidate) => {
        try {
          // Find token decimals to convert amount to raw
          const chainConfig = CHAIN_TOKENS.find((c) => c.chain.id === candidate.chainId);
          const tokenConfig = chainConfig?.tokens.find(
            (t) => t.address.toLowerCase() === candidate.tokenAddress.toLowerCase()
          );

          // Default to 6 decimals (USDC) if not found, or 18 for ETH
          const decimals = tokenConfig?.decimals || (candidate.symbol === 'ETH' ? 18 : 6);

          // For quote, we want to know how much of Source Token is needed to get X USDC on Base.
          // Simplification for Hackathon: Use dummy amount for quote to get gas/time estimates

          let amountForQuote = parseUnits(amount, decimals).toString();
          if (candidate.symbol === 'ETH' || candidate.symbol === 'MATIC') {
            // Use a dummy amount that is likely sufficient for a quote, e.g. 0.1 ETH
            amountForQuote = parseUnits('0.1', decimals).toString();
          }

          const response = await fetch(`https://li.quest/v1/quote?${new URLSearchParams({
            fromChain: candidate.chainId.toString(),
            toChain: base.id.toString(),
            fromToken: candidate.tokenAddress,
            toToken: USDC_ADDRESS[base.id],
            fromAmount: amountForQuote,
            fromAddress: walletAddress,
            toAddress: destinationAddress,
          })}`, {
            headers: process.env.NEXT_PUBLIC_LIFI_API_KEY
              ? { 'x-lifi-api-key': process.env.NEXT_PUBLIC_LIFI_API_KEY }
              : {},
          });

          if (!response.ok) return null;
          const data = await response.json();

          return {
            sourceChainId: candidate.chainId,
            sourceToken: candidate.symbol,
            sourceTokenAddress: candidate.tokenAddress,
            gasCostUsd: data.estimate.gasCosts?.[0]?.amountUSD || '0',
            executionDuration: data.estimate.executionDuration,
            tool: data.tool,
            steps: data.includedSteps?.length || 1,
            action: data.action
          };

        } catch (e) {
          return null;
        }
      })
    );

    const validRoutes = routes.filter((r) => r !== null) as Route[];

    // Sort by gas cost (cheapest first)
    validRoutes.sort((a, b) => parseFloat(a.gasCostUsd) - parseFloat(b.gasCostUsd));

    if (validRoutes.length === 0) {
      return null;
    }

    return {
      routes: validRoutes,
      recommendation: {
        bestRoute: validRoutes[0],
        reason: `Cheapest option: $${parseFloat(validRoutes[0].gasCostUsd).toFixed(2)} gas fee via ${validRoutes[0].tool}`
      }
    };
  } catch (e: any) {
    console.error('Error getting optimal funding routes:', e);
    return null;
  }
}

/**
 * Combined function to scan balances and find best routes in one go
 */
export async function scanAndFindBestRoutes(
  walletAddress: string,
  destinationAddress: string,
  amount: string,
  onProgress?: (progress: ScanProgress) => void
): Promise<RouteAnalysisResult> {
  // 1. Scan wallet balances
  onProgress?.({
    step: 'wallet',
    message: 'Scanning your wallet across 5 chains...',
  });

  const scanResult = await scanWalletBalances(walletAddress);

  if (!scanResult || scanResult.balances.length === 0) {
    throw new Error('No funds found on supported chains');
  }

  // Count tokens found
  const tokensFound = scanResult.balances.reduce((sum, chain) => sum + chain.balances.length, 0);

  onProgress?.({
    step: 'wallet',
    message: `Found ${tokensFound} token(s) on ${scanResult.totalChainsFound} chain(s)`,
    chainsScanned: scanResult.totalChainsFound,
    tokensFound,
  });

  // 2. Prepare candidates (flatten balances)
  const candidateTokens: CandidateToken[] = [];

  scanResult.balances.forEach(chain => {
    chain.balances.forEach(token => {
      // Add as candidate
      candidateTokens.push({
        chainId: chain.chainId,
        tokenAddress: token.tokenAddress,
        symbol: token.symbol
      });
    });
  });

  // Check if user has USDC on Base (direct transfer option)
  const baseBalance = scanResult.balances.find(b => b.chainId === 8453);
  const usdcOnBase = baseBalance?.balances.find(t => t.symbol === 'USDC');
  const hasDirectTransfer = usdcOnBase && parseFloat(usdcOnBase.amount) >= parseFloat(amount);

  // Limit to top 5 to avoid API rate limits
  const topCandidates = candidateTokens.slice(0, 5);

  // 3. Get routes
  onProgress?.({
    step: 'routes',
    message: 'Calculating optimal routes via LI.FI...',
  });

  const routeResult = await getOptimalFundingRoutes(
    walletAddress,
    destinationAddress,
    amount,
    topCandidates
  );

  if (!routeResult) {
    throw new Error('No valid routes found via LI.FI');
  }

  // Add direct transfer as a route option if available
  if (hasDirectTransfer && usdcOnBase) {
    routeResult.routes.push({
      sourceChainId: 8453,
      sourceToken: 'USDC',
      sourceTokenAddress: USDC_ADDRESS[8453],
      gasCostUsd: '0.01', // Minimal Base gas
      executionDuration: 10, // Seconds
      tool: 'Direct Transfer',
      steps: 1,
      isDirect: true,
    } as Route & { isDirect: boolean });

    // Re-sort with direct transfer included
    routeResult.routes.sort((a, b) => parseFloat(a.gasCostUsd) - parseFloat(b.gasCostUsd));

    // Update recommendation if direct transfer is now cheapest
    if (routeResult.routes[0].tool === 'Direct Transfer') {
      routeResult.recommendation = {
        bestRoute: routeResult.routes[0],
        reason: 'Fastest and cheapest: Direct USDC transfer on Base (no bridge needed)'
      };
    }
  }

  onProgress?.({
    step: 'comparing',
    message: `Comparing ${routeResult.routes.length} route(s)...`,
    routesCalculated: routeResult.routes.length,
  });

  return routeResult;
}
