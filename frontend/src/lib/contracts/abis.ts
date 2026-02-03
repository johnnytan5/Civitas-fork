// ============================================================================
// CivitasFactory ABI
// ============================================================================

export const CIVITAS_FACTORY_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_usdc', type: 'address', internalType: 'address' },
      { name: '_rentVaultImpl', type: 'address', internalType: 'address' },
      { name: '_groupBuyEscrowImpl', type: 'address', internalType: 'address' },
      { name: '_stableAllowanceTreasuryImpl', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createRentVault',
    inputs: [
      { name: '_recipient', type: 'address', internalType: 'address' },
      { name: '_rentAmount', type: 'uint256', internalType: 'uint256' },
      { name: '_dueDate', type: 'uint256', internalType: 'uint256' },
      { name: '_tenants', type: 'address[]', internalType: 'address[]' },
      { name: '_shareBps', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    outputs: [{ name: 'clone', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createGroupBuyEscrow',
    inputs: [
      { name: '_recipient', type: 'address', internalType: 'address' },
      { name: '_fundingGoal', type: 'uint256', internalType: 'uint256' },
      { name: '_expiryDate', type: 'uint256', internalType: 'uint256' },
      { name: '_timelockRefundDelay', type: 'uint256', internalType: 'uint256' },
      { name: '_participants', type: 'address[]', internalType: 'address[]' },
      { name: '_shareBps', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    outputs: [{ name: 'clone', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createStableAllowanceTreasury',
    inputs: [
      { name: '_owner', type: 'address', internalType: 'address' },
      { name: '_recipient', type: 'address', internalType: 'address' },
      { name: '_allowancePerIncrement', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: 'clone', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'usdc',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rentVaultImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'groupBuyEscrowImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'stableAllowanceTreasuryImpl',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'RentVaultCreated',
    inputs: [
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'clone', type: 'address', indexed: true, internalType: 'address' },
      { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GroupBuyEscrowCreated',
    inputs: [
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'clone', type: 'address', indexed: true, internalType: 'address' },
      { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TreasuryCreated',
    inputs: [
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'clone', type: 'address', indexed: true, internalType: 'address' },
      { name: 'owner_', type: 'address', indexed: true, internalType: 'address' },
    ],
    anonymous: false,
  },
] as const;

// ============================================================================
// Legacy ABIs (keeping for backward compatibility)
// ============================================================================

export const RENTAL_FACTORY_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_implementation', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deployRental',
    inputs: [
      { name: 'landlord', type: 'address', internalType: 'address' },
      { name: 'tenant', type: 'address', internalType: 'address' },
      { name: 'monthlyAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'totalMonths', type: 'uint8', internalType: 'uint8' },
      { name: 'suggestedName', type: 'string', internalType: 'string' },
    ],
    outputs: [{ name: 'rental', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'predictRentalAddress',
    inputs: [
      { name: 'deployer', type: 'address', internalType: 'address' },
      { name: 'suggestedName', type: 'string', internalType: 'string' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'implementation',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'RentalDeployed',
    inputs: [
      { name: 'creator', type: 'address', indexed: true, internalType: 'address' },
      { name: 'rental', type: 'address', indexed: true, internalType: 'address' },
      { name: 'landlord', type: 'address', indexed: true, internalType: 'address' },
      { name: 'tenant', type: 'address', indexed: false, internalType: 'address' },
      { name: 'suggestedName', type: 'string', indexed: false, internalType: 'string' },
    ],
    anonymous: false,
  },
] as const;

export const RECURRING_RENT_ABI = [
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      { name: '_landlord', type: 'address', internalType: 'address' },
      { name: '_tenant', type: 'address', internalType: 'address' },
      { name: '_monthlyAmount', type: 'uint256', internalType: 'uint256' },
      { name: '_totalMonths', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkAndActivate',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'releasePendingRent',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'initiateTermination',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'finalizeTermination',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'landlord',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tenant',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'monthlyAmount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalMonths',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'startTime',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalPaid',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'state',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum RecurringRent.State' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'terminationNoticeTime',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ContractActivated',
    inputs: [
      { name: 'startTime', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RentReleased',
    inputs: [
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'totalPaid', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TerminationInitiated',
    inputs: [
      { name: 'noticeTime', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ContractTerminated',
    inputs: [
      { name: 'refundAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
] as const;

// ============================================================================
// RentVault ABI
// ============================================================================

export const RENT_VAULT_ABI = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawToRecipient',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'refundAll',
    inputs: [{ name: 'tenants', type: 'address[]', internalType: 'address[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recipient',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rentAmount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'dueDate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalDeposited',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdrawn',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isTenant',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRecipient',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tenantBalances',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shareBps',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tenantMaxContribution',
    inputs: [{ name: 'tenant', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// ============================================================================
// GroupBuyEscrow ABI
// ============================================================================

export const GROUP_BUY_ESCROW_ABI = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confirmDelivery',
    inputs: [{ name: 'proof', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'voteRelease',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'refund',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'timelockRefund',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'releaseFunds',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recipient',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fundingGoal',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'expiryDate',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalDeposited',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'goalReachedAt',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deliveryConfirmedAt',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deliveryProof',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'released',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'yesVotes',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'participantCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deposits',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shareBps',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasVoted',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isParticipant',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRecipientAddress',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'needsMajority',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'participantMaxContribution',
    inputs: [{ name: 'participant', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timelockRefundDelay',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// ============================================================================
// StableAllowanceTreasury ABI
// ============================================================================

export const STABLE_ALLOWANCE_TREASURY_ABI = [
  {
    type: 'function',
    name: 'deposit',
    inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claim',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'incrementCounter',
    inputs: [{ name: '_incrementBy', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'terminate',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'emergencyWithdraw',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getTreasuryStatus',
    inputs: [],
    outputs: [
      { name: '_owner', type: 'address', internalType: 'address' },
      { name: '_recipient', type: 'address', internalType: 'address' },
      { name: '_allowancePerIncrement', type: 'uint256', internalType: 'uint256' },
      { name: '_approvalCounter', type: 'uint256', internalType: 'uint256' },
      { name: '_claimedCount', type: 'uint256', internalType: 'uint256' },
      { name: '_unclaimed', type: 'uint256', internalType: 'uint256' },
      { name: '_balance', type: 'uint256', internalType: 'uint256' },
      { name: '_state', type: 'uint8', internalType: 'enum StableAllowanceTreasury.State' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'recipient',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowancePerIncrement',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approvalCounter',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claimedCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'state',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum StableAllowanceTreasury.State' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'treasuryBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'unclaimedAllowances',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
