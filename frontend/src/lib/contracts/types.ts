// Contract template types
export type ContractTemplate = 'RentVault' | 'GroupBuyEscrow' | 'StableAllowanceTreasury';

// User role types
export type UserRole = 'receiver' | 'payer' | 'none';

// Base contract interface
export interface BaseContract {
  address: `0x${string}`;
  template: ContractTemplate;
  state: number;
}

// RentVault contract
export interface RentVaultContract extends BaseContract {
  template: 'RentVault';
  recipient: `0x${string}`;
  rentAmount: bigint;
  dueDate: bigint;
  totalDeposited: bigint;
  withdrawn: boolean;
  tenantBalances: Record<string, bigint>;
  shareBps: Record<string, number>;
}

// GroupBuyEscrow contract
export interface GroupBuyEscrowContract extends BaseContract {
  template: 'GroupBuyEscrow';
  recipient: `0x${string}`;
  fundingGoal: bigint;
  expiryDate: bigint;
  totalDeposited: bigint;
  goalReachedAt: bigint;
  deliveryConfirmedAt: bigint;
  deliveryProof: string;
  released: boolean;
  yesVotes: number;
  participantCount: number;
  deposits: Record<string, bigint>;
  shareBps: Record<string, number>;
}

// StableAllowanceTreasury contract
export interface StableAllowanceTreasuryContract extends BaseContract {
  template: 'StableAllowanceTreasury';
  owner: `0x${string}`;
  recipient: `0x${string}`;
  allowancePerIncrement: bigint;
  approvalCounter: number;
  claimedCount: number;
  treasuryBalance: bigint;
  state: 0 | 1 | 2; // Active, Paused, Terminated
}

// Union type for all contracts
export type AnyContract = RentVaultContract | GroupBuyEscrowContract | StableAllowanceTreasuryContract;
