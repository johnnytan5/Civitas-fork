# Supabase Integration

This document describes how Civitas integrates with Supabase for data persistence and caching.

## Architecture

**Hybrid Model: Blockchain + Database**
- **Blockchain (Base L2)**: Source of truth for contract state
- **Supabase**: Read-optimized cache for fast queries + chat history persistence

## Database Schema

### Tables

**users**
- Wallet-based user records
- Stores ENS name resolution
- Primary key: `wallet_address`

**rental_contracts**
- Cached contract data from blockchain
- Includes computed fields (`total_amount`, `is_active`)
- Stale detection via `last_synced_at`

**user_contracts**
- Many-to-many relationship between users and contracts
- Tracks role (landlord/tenant)

**contract_events**
- Audit log of state changes
- Stores block number and transaction hash

**chat_sessions**
- AI conversation sessions
- Links to deployed contracts

**chat_messages**
- Individual messages within sessions
- Role: user, assistant, system

## Sync Strategy

**On Dashboard Load:**
1. Fetch cached contracts from Supabase (fast)
2. Identify stale contracts (last_synced_at > 5 minutes)
3. Re-sync stale contracts in background
4. Return cached data immediately (optimistic rendering)

**On Contract Deployment:**
1. Deploy contract to blockchain
2. Create database record in Supabase
3. Create user-contract relationships
4. Link chat session to contract

**Manual Sync:**
- API endpoint: `POST /api/contracts/sync`
- Client hook: `useContractSync()`

## Row Level Security (RLS)

All tables use RLS policies based on wallet address:
- Users can read all contracts (public data)
- Users can only modify their own records
- Users can only access their own chat sessions

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://rauowpwmuscewwffpocn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (server-side only)
```

## Key Files

**Supabase Clients:**
- `lib/supabase/client.ts` - Browser client (client components)
- `lib/supabase/server.ts` - Server client (server components, API routes)
- `lib/supabase/middleware.ts` - Session refresh middleware

**Service Layers:**
- `lib/supabase/contracts.ts` - Contract CRUD operations
- `lib/supabase/users.ts` - User CRUD operations
- `lib/supabase/chat.ts` - Chat history operations
- `lib/supabase/sync.ts` - Blockchain sync utilities

**Hooks:**
- `lib/supabase/hooks/usePersistedChat.ts` - Persisted chat hook
- `lib/supabase/hooks/useContractSync.ts` - Manual sync hook

**API Routes:**
- `app/api/contracts/sync/route.ts` - On-demand contract sync endpoint

## Testing

**Manual Testing:**
1. Deploy a contract via UI
2. Check Supabase dashboard: `rental_contracts` table should have new row
3. Refresh dashboard: contracts should load from cache
4. Wait 5+ minutes, refresh: stale contracts re-sync

**Database Console:**
```sql
-- Check recent contracts
SELECT * FROM rental_contracts ORDER BY created_at DESC LIMIT 10;

-- Check sync staleness
SELECT contract_address, last_synced_at,
  EXTRACT(EPOCH FROM (NOW() - last_synced_at)) as seconds_since_sync
FROM rental_contracts
WHERE last_synced_at < NOW() - INTERVAL '5 minutes';
```

## Troubleshooting

**"Failed to create contract record"**
- Check Supabase project status (should be ACTIVE_HEALTHY)
- Verify environment variables are set
- Check RLS policies allow insert

**"Contracts not syncing"**
- Check `last_synced_at` timestamp
- Verify `/api/contracts/sync` endpoint works
- Check blockchain RPC URL is correct

**"Chat history not persisting"**
- Verify user is connected (wallet address available)
- Check chat session was created (`chat_sessions` table)
- Verify RLS policy allows user to read their sessions

## Usage Patterns

### Server Components (Fast, Cached)
```typescript
import { getUserContracts } from '@/lib/supabase/contracts'

export default async function Page() {
  const contracts = await getUserContracts(userAddress)
  return <ContractList contracts={contracts} />
}
```

### Client Components (Hooks)
```typescript
'use client'
import { useContractSync } from '@/lib/supabase/hooks/useContractSync'

export function ContractCard() {
  const { syncContract, isSyncing } = useContractSync()

  const handleRefresh = async () => {
    await syncContract(contractAddress)
  }

  return <button onClick={handleRefresh} disabled={isSyncing}>Refresh</button>
}
```

### API Routes (Mutations)
```typescript
import { createContract } from '@/lib/supabase/contracts'

export async function POST(request: Request) {
  const contract = await createContract(data)
  return Response.json({ contract })
}
```

## Performance Considerations

**Caching Benefits:**
- Dashboard loads in ~50ms vs ~2-3 seconds (40-60x faster)
- Reduced RPC calls to Base L2
- Improved user experience with instant page loads

**Sync Overhead:**
- Background sync adds ~200-300ms per stale contract
- Non-blocking (fire-and-forget pattern)
- Automatic staleness detection (5-minute threshold)

## Security

**Row Level Security:**
- All tables protected with RLS policies
- Wallet-based authentication via JWT claims
- Service role key used only on server-side
- Anon key safe for client-side usage

**Best Practices:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Use server components for sensitive queries
- Validate all user inputs before database writes
- Monitor RLS policies via Supabase security advisor
