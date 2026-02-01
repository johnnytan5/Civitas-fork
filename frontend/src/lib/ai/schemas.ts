import { z } from 'zod';

export const RentalConfigSchema = z.object({
  tenant: z.string().describe('ENS name or Ethereum address'),
  monthlyAmount: z.number().positive().describe('Monthly rent in USDC'),
  totalMonths: z.number().int().min(1).max(60).describe('Duration in months'),
  needsClarification: z.boolean().optional().describe('Whether AI needs more info'),
  clarificationQuestion: z.string().optional().describe('Question to ask user'),
});

export type RentalConfig = z.infer<typeof RentalConfigSchema>;

export const NameSuggestionSchema = z.object({
  suggestedName: z.string().max(20).describe('Semantic subdomain name (lowercase, hyphenated)'),
  reasoning: z.string().optional().describe('Why this name was chosen'),
});

export type NameSuggestion = z.infer<typeof NameSuggestionSchema>;
