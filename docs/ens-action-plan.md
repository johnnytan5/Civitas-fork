# ENS Action Plan - Goal 2: Auto-register contract ENS names

**Date:** 2026-02-05
**Focus:** When a user deploys a contract, it automatically gets an ENS subdomain under `civitas.basetest.eth` with metadata, and anyone can verify it on our public explorer.

**On hold:** Goal 1 (ENS names as input parameters for contract participants)

---

## What's already done

- [x] Smart contracts: `createSubdomainAndSetRecords()` on CivitasFactory
- [x] Smart contracts: `getENSMetadata()` on all 3 templates
- [x] Smart contracts: ENS interfaces, text records, forward resolution
- [x] Factory deployed to Base Sepolia with correct ENS config
- [x] Factory approved as operator on ENS registry
- [x] Verified end-to-end: subdomain creation + text records + addr resolution

## What needs to be built

### Task 1: Wire ENS subdomain creation into frontend deploy flow

**Files:** `hooks/useCivitasContractDeploy.ts`, `components/deploy/DeployModal.tsx`

After the contract deployment transaction succeeds:
1. Call `/api/generate-name` to get an AI-generated semantic basename
2. Call `factory.createSubdomainAndSetRecords(cloneAddress, basename, keys, values)` as a second transaction
3. Store the full ENS name (`basename-hash.civitas.basetest.eth`) in Supabase alongside the contract record

### Task 2: Build `useContractENSData` hook

**File:** `hooks/useContractENSData.ts`

- Read ENS text records for a given basename from the Base Sepolia L2 Resolver
- Return parsed metadata: type, status, participants, rent amount, etc.
- Use viem `getEnsText` or direct contract calls to L2 Resolver (`0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA`)

### Task 3: Show ENS name on contract detail pages

**Files:** `components/contracts/GenericContractCard.tsx`, `app/contracts/[address]/page.tsx`

- Display the ENS name (e.g., `downtown-studio-a3f9.civitas.basetest.eth`) on the card
- Show a badge indicating "ENS Verified" with the name
- Link to the public verify page

### Task 4: Build public verification page

**File:** `app/verify/page.tsx` (new)

- No wallet required - read-only page
- Input: ENS name or contract address
- Resolves ENS name → contract address via L2 Resolver
- Displays all text records (type, status, amount, participants)
- Links to BaseScan for the contract address
- This is our equivalent of base.org/names for Civitas contracts

### Task 5: Update Supabase schema for ENS data

- Add `ens_name` column to contracts table
- Store the full subdomain name on contract creation
- Enable querying contracts by ENS name

---

## Implementation order

1. **Task 1** (deploy flow) - core functionality
2. **Task 5** (Supabase) - needed by Task 1
3. **Task 2** (hook) - needed by Tasks 3 and 4
4. **Task 3** (contract cards) - display
5. **Task 4** (verify page) - public discovery

## Key addresses (Base Sepolia)

| Contract | Address |
|----------|---------|
| CivitasFactory | `0x1cF969a2D882A09927f051D4F8e9e31160Abe894` |
| ENS Registry | `0x1493b2567056c2181630115660963E13A8E32735` |
| L2 Resolver | `0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA` |
| Reverse Registrar | `0x876eF94ce0773052a2f81921E70FF25a5e76841f` |
| Parent Node | `0x1cbe20cfde3e946c37b02416f99842c64646625dd3d54f636c384d31c291523b` |
