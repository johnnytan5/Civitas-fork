import { parseUnits } from 'viem';
import type { 
  RentVaultParams,
  GroupBuyEscrowParams,
  StableAllowanceTreasuryParams,
} from '@/hooks/useCivitasContractDeploy';
import type { 
  RentVaultConfig,
  GroupBuyEscrowConfig,
  StableAllowanceTreasuryConfig,
} from '@/lib/ai/schemas';

/**
 * Transform AI-extracted config to deployment parameters
 */
export function transformConfigToDeployParams(
  templateId: string,
  config: any
): RentVaultParams | GroupBuyEscrowParams | StableAllowanceTreasuryParams {
  switch (templateId) {
    case 'rent-vault': {
      const c = config as RentVaultConfig;
      
      // Parse rent amount (could be string with commas or just a number string)
      const rentAmountStr = c.rentAmount.replace(/,/g, '');
      const rentAmount = parseUnits(rentAmountStr, 6);
      
      // Parse due date (could be ISO string or timestamp)
      let dueDate: bigint;
      if (c.dueDate.includes('-') || c.dueDate.includes('T')) {
        // ISO date string
        dueDate = BigInt(Math.floor(new Date(c.dueDate).getTime() / 1000));
      } else {
        // Assume it's already a timestamp
        dueDate = BigInt(c.dueDate);
      }
      
      // Convert shareBps to bigint array
      const shareBps = c.shareBps.map(s => BigInt(s));
      
      return {
        recipient: c.recipient as `0x${string}`,
        rentAmount,
        dueDate,
        tenants: c.tenants as `0x${string}`[],
        shareBps,
      };
    }

    case 'group-buy-escrow': {
      const c = config as GroupBuyEscrowConfig;
      
      // Parse funding goal
      const fundingGoalStr = c.fundingGoal.replace(/,/g, '');
      const fundingGoal = parseUnits(fundingGoalStr, 6);
      
      // Parse expiry date
      let expiryDate: bigint;
      if (c.expiryDate.includes('-') || c.expiryDate.includes('T')) {
        expiryDate = BigInt(Math.floor(new Date(c.expiryDate).getTime() / 1000));
      } else {
        expiryDate = BigInt(c.expiryDate);
      }
      
      // Parse timelock delay (could be in days, convert to seconds)
      let timelockRefundDelay: bigint;
      const delayStr = c.timelockRefundDelay.replace(/,/g, '');
      const delayNum = parseFloat(delayStr);
      // If less than 1000, assume days and convert to seconds
      if (delayNum < 1000) {
        timelockRefundDelay = BigInt(Math.floor(delayNum * 86400));
      } else {
        timelockRefundDelay = BigInt(delayNum);
      }
      
      // Convert shareBps to bigint array
      const shareBps = c.shareBps.map(s => BigInt(s));
      
      return {
        recipient: c.recipient as `0x${string}`,
        fundingGoal,
        expiryDate,
        timelockRefundDelay,
        participants: c.participants as `0x${string}`[],
        shareBps,
      };
    }

    case 'stable-allowance-treasury': {
      const c = config as StableAllowanceTreasuryConfig;
      
      // Parse allowance amount
      const allowanceStr = c.allowancePerIncrement.replace(/,/g, '');
      const allowancePerIncrement = parseUnits(allowanceStr, 6);
      
      return {
        owner: c.owner as `0x${string}`,
        recipient: c.recipient as `0x${string}`,
        allowancePerIncrement,
      };
    }

    default:
      throw new Error(`Unknown template: ${templateId}`);
  }
}

/**
 * Validate config before deployment
 */
export function validateConfig(templateId: string, config: any): string | null {
  switch (templateId) {
    case 'rent-vault': {
      const c = config as RentVaultConfig;
      if (!c.recipient || !c.rentAmount || !c.dueDate || !c.tenants || !c.shareBps) {
        return 'Missing required fields';
      }
      if (c.tenants.length === 0) {
        return 'At least one tenant required';
      }
      if (c.tenants.length !== c.shareBps.length) {
        return 'Tenants and shareBps arrays must be same length';
      }
      const totalBps = c.shareBps.reduce((sum, bps) => sum + bps, 0);
      if (totalBps !== 10000) {
        return `Share basis points must sum to 10,000 (currently ${totalBps})`;
      }
      return null;
    }

    case 'group-buy-escrow': {
      const c = config as GroupBuyEscrowConfig;
      if (!c.recipient || !c.fundingGoal || !c.expiryDate || !c.timelockRefundDelay || !c.participants || !c.shareBps) {
        return 'Missing required fields';
      }
      if (c.participants.length === 0) {
        return 'At least one participant required';
      }
      if (c.participants.length !== c.shareBps.length) {
        return 'Participants and shareBps arrays must be same length';
      }
      const totalBps = c.shareBps.reduce((sum, bps) => sum + bps, 0);
      if (totalBps !== 10000) {
        return `Share basis points must sum to 10,000 (currently ${totalBps})`;
      }
      return null;
    }

    case 'stable-allowance-treasury': {
      const c = config as StableAllowanceTreasuryConfig;
      if (!c.owner || !c.recipient || !c.allowancePerIncrement) {
        return 'Missing required fields';
      }
      if (c.owner.toLowerCase() === c.recipient.toLowerCase()) {
        return 'Owner and recipient must be different addresses';
      }
      return null;
    }

    default:
      return `Unknown template: ${templateId}`;
  }
}
