# Backend Migration Plan: Serverless to Express

**Date**: 2026-02-02
**Status**: Design Complete
**Author**: Claude Code with Jun Quan

---

## Executive Summary

Migrate Civitas from Next.js serverless API routes to a dedicated Express backend to support:
- **Background jobs**: Automated rent release, periodic contract syncing
- **Event listeners**: Real-time blockchain event subscriptions
- **Better organization**: Clear separation between AI (edge) and data operations (Express)

**Key Decision**: AI endpoints stay in Next.js edge runtime (optimized for streaming), only data/blockchain operations move to Express.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Current State Analysis](#2-current-state-analysis)
3. [Target Architecture](#3-target-architecture)
4. [Code Reuse Strategy](#4-code-reuse-strategy)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Changes](#6-frontend-changes)
7. [Migration Steps](#7-migration-steps)
8. [Testing & Validation](#8-testing--validation)
9. [Deployment Guide](#9-deployment-guide)
10. [Appendix](#10-appendix)

---

## 1. Architecture Overview

### 1.1 Migration Scope

**What moves to Express:**
- ✅ Contract sync endpoint (`/api/contracts/sync`)
- ✅ Background cron jobs (rent release, contract syncing)
- ✅ Blockchain event listeners (ContractDeployed, StateChanged)
- ✅ Future: Webhooks, long-running tasks

**What stays in Next.js:**
- ✅ AI streaming chat (`/api/chat`)
- ✅ Config extraction (`/api/extract-config`)
- ✅ Name generation (`/api/generate-name`)
- ✅ All frontend pages and components

### 1.2 Why This Split?

| Feature | Next.js Edge | Express Backend |
|---------|-------------|-----------------|
| AI streaming | ✅ Optimized | ❌ Loses edge runtime benefits |
| WebSockets | ❌ Not supported | ✅ Full support |
| Cron jobs | ❌ Not supported | ✅ node-cron |
| Event listeners | ❌ Not supported | ✅ viem watchContractEvent |
| Stateful connections | ❌ Serverless limits | ✅ Long-running process |
| Cold starts | ⚠️ Can be slow | ✅ Always running |

---

## 2. Current State Analysis

### 2.1 Existing Next.js API Routes

```
frontend/src/app/api/
├── chat/route.ts              # AI streaming (KEEP)
├── extract-config/route.ts    # AI structured output (KEEP)
├── generate-name/route.ts     # AI name generation (KEEP)
└── contracts/
    └── sync/route.ts          # Blockchain sync (MOVE TO EXPRESS)
```

### 2.2 Current Supabase Architecture (After Recent Fixes)

Based on commit `4fea143`:

**Service Client Pattern** (`frontend/src/lib/supabase/server.ts`):
```typescript
// Anon key - respects RLS
export async function createClient() { ... }

// Service role - bypasses RLS (server-side only)
export function createServiceClient() { ... }
```

**Database Service Layers**:
- `contracts.ts`: CRUD operations using `createServiceClient()`
- `users.ts`: User management using `createServiceClient()`
- `chat.ts`: Chat persistence using `createServiceClient()`
- `sync.ts`: Blockchain → Supabase sync logic

**RLS Policies** (from `docs/database/schema.sql`):
- Public read access for all tables
- Service role can INSERT/UPDATE (bypasses RLS)
- Foreign key constraints enforce referential integrity
- Application-level access control in service layer

### 2.3 What Works Well (Keep This)

✅ **Service client pattern** - Already separates client/server operations
✅ **Detailed error logging** - code, message, details, hint
✅ **SQL injection protection** - Sanitized LIKE queries
✅ **Foreign key constraints** - Tenant/landlord relationships enforced
✅ **Type safety** - Full TypeScript types from Supabase schema

---

## 3. Target Architecture

### 3.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  Pages/UI      │  │  AI Endpoints  │  │  Hooks       │  │
│  │  (React)       │  │  (Edge Runtime)│  │  (Client)    │  │
│  └────────┬───────┘  └────────┬───────┘  └──────┬───────┘  │
│           │                   │                   │          │
└───────────┼───────────────────┼───────────────────┼──────────┘
            │                   │                   │
            │                   │                   │
            ├───────────────────┤                   │
            │ HTTP API Calls    │                   │
            ▼                   ▼                   ▼
┌───────────────────────────────────────────────────────────────┐
│                      Backend (Express)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Routes     │  │   Services   │  │   Background     │   │
│  │              │  │              │  │                  │   │
│  │ /contracts   │─▶│ Blockchain   │  │ ┌──────────────┐ │   │
│  │ /health      │  │ Database     │  │ │ Cron Jobs    │ │   │
│  └──────────────┘  └──────┬───────┘  │ │ - syncContracts│   │
│                            │          │ │ - releaseRent  │   │
│                            │          │ └──────────────┘ │   │
│                            │          │ ┌──────────────┐ │   │
│                            │          │ │ Event Listen.│ │   │
│                            │          │ │ - Deployed   │ │   │
│                            │          │ └──────────────┘ │   │
│                            ▼          └──────────────────┘   │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
            ┌───────────────┐  ┌─────────────┐
            │   Supabase    │  │  Base L2    │
            │  (Postgres)   │  │ (Blockchain)│
            └───────────────┘  └─────────────┘
```

### 3.2 Backend Directory Structure

```
backend/
├── src/
│   ├── index.ts                    # Express app + server initialization
│   │
│   ├── config/
│   │   ├── environment.ts          # Environment variable validation
│   │   └── blockchain.ts           # viem publicClient configuration
│   │
│   ├── lib/
│   │   └── supabase/               # SYMLINK → frontend/src/lib/supabase
│   │       ├── server.ts           # createClient() + createServiceClient()
│   │       ├── contracts.ts        # Contract CRUD operations
│   │       ├── users.ts            # User management
│   │       ├── chat.ts             # Chat persistence
│   │       ├── sync.ts             # Blockchain → Supabase sync
│   │       └── types.ts            # Database types
│   │
│   ├── routes/
│   │   ├── index.ts                # Route aggregator
│   │   ├── health.ts               # GET /health
│   │   └── contracts.ts            # POST /api/contracts/sync
│   │
│   ├── services/
│   │   ├── blockchain/
│   │   │   ├── client.ts           # Shared viem publicClient
│   │   │   ├── reader.ts           # Read contract state from chain
│   │   │   └── writer.ts           # Trigger transactions (releasePendingRent)
│   │   │
│   │   └── cron/
│   │       ├── scheduler.ts        # Cron job registration (node-cron)
│   │       └── jobs/
│   │           ├── syncContracts.ts    # Every 5min: sync all active contracts
│   │           └── releaseRent.ts      # Every hour: trigger rent release
│   │
│   ├── listeners/
│   │   ├── setup.ts                # Event listener initialization
│   │   └── handlers/
│   │       └── contractDeployed.ts # Handle ContractDeployed event
│   │
│   └── utils/
│       ├── logger.ts               # Structured logging (winston/pino)
│       ├── errors.ts               # Custom error classes
│       └── asyncHandler.ts         # Async route error wrapper
│
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env                            # Backend environment variables
```

### 3.3 Request Flow Examples

**Example 1: User Triggers Contract Sync**
1. Frontend: `useContractSync().sync(address)`
2. HTTP POST → `http://localhost:3001/api/contracts/sync`
3. Express route → `syncContractFromBlockchain()` service
4. Service: viem reads blockchain → writes to Supabase
5. Response returns updated contract to frontend

**Example 2: Background Cron Job**
1. Every 5 minutes: `syncContractsJob()` runs
2. Queries Supabase for contracts in Active/TerminationPending states
3. For each contract: calls `syncContractFromBlockchain()`
4. Logs results (succeeded/failed counts)

**Example 3: Blockchain Event**
1. Factory emits `ContractDeployed` event on Base L2
2. viem `watchContractEvent` catches it
3. Event listener → `handleContractDeployed()`
4. Handler → `syncContractFromBlockchain()` → Supabase insert
5. Frontend dashboard updates via Supabase Realtime subscription

---

## 4. Code Reuse Strategy

### 4.1 Why Symlinks?

Your recent commit (`4fea143`) perfected the Supabase service layer:
- ✅ Service client pattern working
- ✅ RLS policies optimized
- ✅ Foreign key constraints added
- ✅ Error handling with detailed logging
- ✅ SQL injection protection

**Don't duplicate this code** - reuse it via symlinks.

### 4.2 Symlink Setup

```bash
cd backend/src

# Create symlink to frontend's lib directory
ln -s ../../frontend/src/lib lib

# Verify symlink
ls -la lib/supabase
# Expected output:
# server.ts
# contracts.ts
# users.ts
# chat.ts
# sync.ts
# types.ts
# ... (all Supabase files)
```

### 4.3 Import Paths in Backend

Backend code can now import from frontend:

```typescript
// backend/src/services/cron/jobs/syncContracts.ts
import { getContractsByState } from '@/lib/supabase/contracts'
import { syncContractFromBlockchain } from '@/lib/supabase/sync'
```

### 4.4 TypeScript Path Aliases

Update `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 5. Backend Implementation

### 5.1 Environment Configuration

**`config/environment.ts`** - Validate env vars on startup:

```typescript
import dotenv from 'dotenv'

dotenv.config()

interface Environment {
  NODE_ENV: string
  PORT: number
  FRONTEND_URL: string

  // Blockchain
  BASE_RPC_URL: string
  FACTORY_ADDRESS: `0x${string}`

  // Supabase (same var names as frontend)
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // Optional: Keeper wallet for triggering transactions
  KEEPER_PRIVATE_KEY?: string
}

function validateEnv(): Environment {
  const required = [
    'BASE_RPC_URL',
    'FACTORY_ADDRESS',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    BASE_RPC_URL: process.env.BASE_RPC_URL!,
    FACTORY_ADDRESS: process.env.FACTORY_ADDRESS as `0x${string}`,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    KEEPER_PRIVATE_KEY: process.env.KEEPER_PRIVATE_KEY,
  }
}

export const env = validateEnv()
```

**`config/blockchain.ts`** - viem client setup:

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { env } from './environment'

export const publicClient = createPublicClient({
  chain: base,
  transport: http(env.BASE_RPC_URL),
})
```

### 5.2 Utilities

**`utils/logger.ts`** - Structured logging:

```typescript
type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    }

    console.log(JSON.stringify(logEntry))
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }
}

export const logger = new Logger()
```

**`utils/asyncHandler.ts`** - Async route error wrapper:

```typescript
import { Request, Response, NextFunction } from 'express'

/**
 * Wraps async route handlers to catch promise rejections
 * and pass them to Express error middleware
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
```

**`utils/errors.ts`** - Custom error classes:

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400)
  }
}

export class BlockchainError extends AppError {
  constructor(message: string = 'Blockchain operation failed') {
    super(message, 502)
  }
}
```

### 5.3 Blockchain Services

**`services/blockchain/reader.ts`** - Read contract state:

```typescript
import { publicClient } from '@/config/blockchain'
import { RECURRING_RENT_ABI } from '@/lib/contracts/abis'
import type { Address } from 'viem'

export interface ContractState {
  landlord: Address
  tenant: Address
  monthlyAmount: bigint
  totalMonths: number
  startTimestamp: bigint
  state: number
  terminationInitiatedAt: bigint
}

/**
 * Read complete contract state from blockchain
 */
export async function readContractState(
  contractAddress: Address
): Promise<ContractState> {
  const [
    landlord,
    tenant,
    monthlyAmount,
    totalMonths,
    startTimestamp,
    state,
    terminationInitiatedAt,
  ] = await Promise.all([
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'landlord',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'tenant',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'monthlyAmount',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'totalMonths',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'startTimestamp',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'state',
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'terminationInitiatedAt',
    }),
  ])

  return {
    landlord,
    tenant,
    monthlyAmount,
    totalMonths,
    startTimestamp,
    state,
    terminationInitiatedAt,
  }
}
```

**`services/blockchain/writer.ts`** - Trigger transactions:

```typescript
import { publicClient } from '@/config/blockchain'
import { env } from '@/config/environment'
import { RECURRING_RENT_ABI } from '@/lib/contracts/abis'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import type { Address } from 'viem'
import { logger } from '@/utils/logger'

/**
 * Trigger rent release for a contract
 * Requires KEEPER_PRIVATE_KEY to be set
 */
export async function triggerRentRelease(contractAddress: Address) {
  if (!env.KEEPER_PRIVATE_KEY) {
    logger.warn('KEEPER_PRIVATE_KEY not set, skipping rent release', {
      contractAddress,
    })
    return
  }

  try {
    const account = privateKeyToAccount(env.KEEPER_PRIVATE_KEY as `0x${string}`)

    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(env.BASE_RPC_URL),
    })

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'releasePendingRent',
    })

    logger.info('Rent release transaction sent', {
      contractAddress,
      transactionHash: hash,
    })

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    logger.info('Rent release confirmed', {
      contractAddress,
      transactionHash: hash,
      status: receipt.status,
    })

    return receipt
  } catch (error) {
    logger.error('Failed to trigger rent release', {
      contractAddress,
      error,
    })
    throw error
  }
}
```

### 5.4 Cron Jobs

**`services/cron/scheduler.ts`** - Register cron jobs:

```typescript
import cron from 'node-cron'
import { syncContractsJob } from './jobs/syncContracts'
import { releaseRentJob } from './jobs/releaseRent'
import { logger } from '@/utils/logger'

export function startCronJobs() {
  // Every 5 minutes: sync all active/terminating contracts
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting contract sync job')
    await syncContractsJob()
  })

  // Every hour: trigger rent release for all active contracts
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting rent release job')
    await releaseRentJob()
  })

  logger.info('Cron jobs registered successfully')
}
```

**`services/cron/jobs/syncContracts.ts`** - Periodic sync:

```typescript
import { getContractsByState } from '@/lib/supabase/contracts'
import { syncContractFromBlockchain } from '@/lib/supabase/sync'
import { logger } from '@/utils/logger'

/**
 * Sync all active and terminating contracts from blockchain
 * Runs every 5 minutes
 */
export async function syncContractsJob() {
  try {
    // Fetch contracts that need regular syncing
    const [activeContracts, terminatingContracts] = await Promise.all([
      getContractsByState(1), // Active
      getContractsByState(3), // TerminationPending
    ])

    const contractsToSync = [...activeContracts, ...terminatingContracts]

    logger.info(`Syncing ${contractsToSync.length} contracts`)

    // Sync each contract (parallel execution)
    const results = await Promise.allSettled(
      contractsToSync.map((contract) =>
        syncContractFromBlockchain(contract.contract_address)
      )
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info(`Sync job complete`, { succeeded, failed })

    // Log failures in detail
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error('Contract sync failed', {
          contractAddress: contractsToSync[index].contract_address,
          error: result.reason,
        })
      }
    })
  } catch (error) {
    logger.error('Sync job failed catastrophically', { error })
  }
}
```

**`services/cron/jobs/releaseRent.ts`** - Auto-release rent:

```typescript
import { getContractsByState } from '@/lib/supabase/contracts'
import { triggerRentRelease } from '@/services/blockchain/writer'
import { logger } from '@/utils/logger'

/**
 * Trigger rent release for all active contracts
 * Runs hourly
 */
export async function releaseRentJob() {
  try {
    const activeContracts = await getContractsByState(1) // Active state

    logger.info(`Checking ${activeContracts.length} active contracts for rent release`)

    const results = await Promise.allSettled(
      activeContracts.map((contract) =>
        triggerRentRelease(contract.contract_address)
      )
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info(`Rent release job complete`, { succeeded, failed })

    // Log failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error('Rent release failed', {
          contractAddress: activeContracts[index].contract_address,
          error: result.reason,
        })
      }
    })
  } catch (error) {
    logger.error('Rent release job failed catastrophically', { error })
  }
}
```

### 5.5 Event Listeners

**`listeners/setup.ts`** - Initialize event listeners with retry logic:

```typescript
import { publicClient } from '@/config/blockchain'
import { RENTAL_FACTORY_ABI } from '@/lib/contracts/abis'
import { env } from '@/config/environment'
import { handleContractDeployed } from './handlers/contractDeployed'
import { logger } from '@/utils/logger'

const MAX_RETRIES = 5
const RETRY_DELAY = 5000 // 5 seconds

/**
 * Start factory event listener with automatic reconnection on failure
 */
function startFactoryListener(retries = 0) {
  try {
    const unwatch = publicClient.watchContractEvent({
      address: env.FACTORY_ADDRESS,
      abi: RENTAL_FACTORY_ABI,
      eventName: 'ContractDeployed',
      onLogs: (logs) => {
        logs.forEach((log) => {
          handleContractDeployed(log).catch((error) => {
            logger.error('Error handling ContractDeployed event', {
              error,
              log,
            })
          })
        })
      },
      onError: (error) => {
        logger.error('Event listener error - ContractDeployed', {
          error,
          retries,
        })

        // Attempt reconnection with exponential backoff
        if (retries < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retries) // Exponential backoff
          setTimeout(() => {
            logger.info(`Reconnecting listener`, {
              attempt: retries + 1,
              maxRetries: MAX_RETRIES,
            })
            unwatch() // Clean up old listener
            startFactoryListener(retries + 1)
          }, delay)
        } else {
          logger.error('Max retries reached, listener stopped permanently')
        }
      },
    })

    logger.info('Factory event listener started successfully')
  } catch (error) {
    logger.error('Failed to initialize event listener', { error })
    throw error // Fail fast on startup
  }
}

export function startEventListeners() {
  startFactoryListener()
}
```

**`listeners/handlers/contractDeployed.ts`** - Handle deployment events:

```typescript
import { syncContractFromBlockchain } from '@/lib/supabase/sync'
import { logger } from '@/utils/logger'
import type { Log } from 'viem'

/**
 * Handle ContractDeployed event from factory
 * Immediately syncs new contract to Supabase
 */
export async function handleContractDeployed(log: Log) {
  try {
    // Extract contract address from event args
    const contractAddress = log.args.contractAddress as `0x${string}`

    logger.info('New contract deployed', {
      contractAddress,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })

    // Sync immediately to Supabase
    await syncContractFromBlockchain(contractAddress)

    logger.info('Contract synced successfully', { contractAddress })
  } catch (error) {
    logger.error('Failed to handle ContractDeployed event', {
      error,
      log,
    })
    throw error
  }
}
```

### 5.6 Routes

**`routes/index.ts`** - Route aggregator:

```typescript
import { Router } from 'express'
import healthRouter from './health'
import contractsRouter from './contracts'

const router = Router()

router.use('/health', healthRouter)
router.use('/api/contracts', contractsRouter)

export default router
```

**`routes/health.ts`** - Health check endpoint:

```typescript
import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

export default router
```

**`routes/contracts.ts`** - Contract endpoints:

```typescript
import { Router, Request, Response } from 'express'
import { syncContractFromBlockchain } from '@/lib/supabase/sync'
import { asyncHandler } from '@/utils/asyncHandler'
import { ValidationError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import type { Address } from 'viem'

const router = Router()

/**
 * POST /api/contracts/sync
 * Manually trigger contract sync from blockchain to Supabase
 */
router.post('/sync', asyncHandler(async (req: Request, res: Response) => {
  const { contractAddress } = req.body

  if (!contractAddress) {
    throw new ValidationError('Contract address required')
  }

  logger.info('Manual contract sync requested', { contractAddress })

  const contract = await syncContractFromBlockchain(contractAddress as Address)

  res.json({ contract })
}))

export default router
```

### 5.7 Main Application

**`index.ts`** - Express server with proper initialization:

```typescript
import express from 'express'
import cors from 'cors'
import { env } from './config/environment'
import { startCronJobs } from './services/cron/scheduler'
import { startEventListeners } from './listeners/setup'
import { logger } from './utils/logger'
import { AppError } from './utils/errors'
import routes from './routes'

const app = express()

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use(routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  })
})

// Error handling middleware (MUST be last)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Check if it's an operational error
  const isOperationalError = err instanceof AppError && err.isOperational
  const statusCode = err instanceof AppError ? err.statusCode : 500

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    isOperationalError,
  })

  res.status(statusCode).json({
    error: isOperationalError ? err.message : 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Start server
const server = app.listen(env.PORT, () => {
  logger.info(`Server running`, {
    port: env.PORT,
    environment: env.NODE_ENV,
  })

  // Start background services AFTER server is listening
  try {
    startCronJobs()
    startEventListeners()
    logger.info('All services initialized successfully')
  } catch (error) {
    logger.error('Failed to start background services', { error })
    process.exit(1) // Exit if critical services fail
  }
})

// Graceful shutdown handling
const shutdown = () => {
  logger.info('Shutdown signal received, closing server gracefully...')

  server.close(() => {
    logger.info('HTTP server closed')
    // TODO: Close database connections, stop cron jobs, unwatch events
    process.exit(0)
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
```

---

## 6. Frontend Changes

### 6.1 Environment Variables

Add backend URL to `frontend/.env.local`:

```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 6.2 API Client Helper

Create `frontend/src/lib/api/backend.ts`:

```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export class BackendError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message)
  }
}

/**
 * Sync contract from blockchain to Supabase via backend
 */
export async function syncContract(contractAddress: string) {
  const response = await fetch(`${BACKEND_URL}/api/contracts/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractAddress }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new BackendError(
      errorData.error || 'Failed to sync contract',
      response.status,
      errorData
    )
  }

  return response.json()
}
```

### 6.3 Update Hooks

**Update `frontend/src/lib/supabase/hooks/useContractSync.ts`:**

```typescript
import { useState } from 'react'
import { syncContract } from '@/lib/api/backend'

export function useContractSync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sync = async (contractAddress: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await syncContract(contractAddress)
      return result.contract
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { sync, loading, error }
}
```

### 6.4 Delete Old API Route

```bash
# Remove the Next.js API route (replaced by Express backend)
rm frontend/src/app/api/contracts/sync/route.ts
```

### 6.5 Keep AI Routes Unchanged

**No changes needed for:**
- `frontend/src/app/api/chat/route.ts` ✅
- `frontend/src/app/api/extract-config/route.ts` ✅
- `frontend/src/app/api/generate-name/route.ts` ✅

These stay in Next.js edge runtime for optimal AI streaming performance.

---

## 7. Migration Steps

### 7.1 Phase 1: Backend Setup

**Step 1: Install Dependencies**

```bash
cd backend

# Core dependencies
npm install node-cron viem@2 @supabase/supabase-js @supabase/ssr

# Development dependencies
npm install -D @types/node-cron
```

**Step 2: Create Symlink to Frontend Code**

```bash
cd backend/src

# Create symlink to frontend's lib directory
ln -s ../../frontend/src/lib lib

# Verify symlink works
ls -la lib/supabase
# Expected: server.ts, contracts.ts, users.ts, chat.ts, sync.ts, types.ts
```

**Step 3: Set Up Environment Variables**

```bash
cd backend

# Copy frontend env as starting point
cp ../frontend/.env.local .env

# Add backend-specific variables
cat >> .env << 'EOF'

# Backend Server
PORT=3001

# Optional: Keeper wallet for auto-releasing rent
KEEPER_PRIVATE_KEY=0x...
EOF
```

**Step 4: Create Directory Structure**

```bash
cd backend/src

mkdir -p config
mkdir -p routes
mkdir -p services/blockchain
mkdir -p services/cron/jobs
mkdir -p listeners/handlers
mkdir -p utils
```

**Step 5: Verify Package.json Scripts**

Ensure `backend/package.json` has:

```json
{
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit"
  }
}
```

### 7.2 Phase 2: Implement Backend Code

**Implementation order (to avoid dependency issues):**

**1. Utils** (no dependencies):
```bash
# Copy implementations from Section 5.2
touch src/utils/logger.ts
touch src/utils/asyncHandler.ts
touch src/utils/errors.ts
```

**2. Config** (depends on utils):
```bash
# Copy implementations from Section 5.1
touch src/config/environment.ts
touch src/config/blockchain.ts
```

**3. Services** (depends on config + symlinked lib):
```bash
# Copy implementations from Sections 5.3-5.5
touch src/services/blockchain/reader.ts
touch src/services/blockchain/writer.ts
touch src/services/cron/jobs/syncContracts.ts
touch src/services/cron/jobs/releaseRent.ts
touch src/services/cron/scheduler.ts
touch src/listeners/handlers/contractDeployed.ts
touch src/listeners/setup.ts
```

**4. Routes** (depends on services):
```bash
# Copy implementations from Section 5.6
touch src/routes/health.ts
touch src/routes/contracts.ts
touch src/routes/index.ts
```

**5. Main app** (depends on everything):
```bash
# Copy implementation from Section 5.7
touch src/index.ts
```

**6. Verify TypeScript compiles:**
```bash
npm run build
# Should compile without errors
```

### 7.3 Phase 3: Update Frontend

**Step 1: Add Backend URL**
```bash
cd frontend
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" >> .env.local
```

**Step 2: Create API Client**
```bash
mkdir -p src/lib/api
# Copy implementation from Section 6.2
touch src/lib/api/backend.ts
```

**Step 3: Update Hooks**
```bash
# Update implementation from Section 6.3
# Edit: src/lib/supabase/hooks/useContractSync.ts
```

**Step 4: Delete Old API Route**
```bash
rm src/app/api/contracts/sync/route.ts
```

**Step 5: Verify Frontend Builds**
```bash
npm run build
# Should build without errors
```

### 7.4 Phase 4: Test End-to-End

**Step 1: Start Backend**
```bash
cd backend
npm run dev

# Expected logs:
# ✅ "Server running on http://localhost:3001"
# ✅ "Cron jobs registered successfully"
# ✅ "Factory event listener started successfully"
# ✅ "All services initialized successfully"
```

**Step 2: Test Backend Health**
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"2026-02-02T..."}
```

**Step 3: Test Contract Sync Endpoint**
```bash
# Replace with actual contract address
curl -X POST http://localhost:3001/api/contracts/sync \
  -H "Content-Type: application/json" \
  -d '{"contractAddress":"0x..."}'

# Expected: {"contract":{...}}
```

**Step 4: Start Frontend**
```bash
cd frontend
npm run dev

# Frontend should start on http://localhost:3000
```

**Step 5: Test Full Flow**
1. Open browser to `http://localhost:3000`
2. Connect wallet
3. Create a contract via chat
4. Deploy contract
5. Check Network tab - should see POST to `localhost:3001/api/contracts/sync`
6. Verify contract appears in dashboard
7. Check backend logs - should see "Manual contract sync requested"

**Step 6: Test Event Listener**
1. Deploy a new contract from frontend
2. Check backend logs for "New contract deployed"
3. Verify contract immediately appears in Supabase

**Step 7: Test Cron Jobs**
1. Wait 5 minutes
2. Check backend logs for "Starting contract sync job"
3. Verify all active contracts have `last_synced_at` updated in Supabase

---

## 8. Testing & Validation

### 8.1 Unit Tests (Future Enhancement)

**Backend tests to add:**
```
backend/test/
├── services/
│   ├── blockchain/
│   │   └── reader.test.ts
│   └── cron/
│       └── syncContracts.test.ts
├── routes/
│   └── contracts.test.ts
└── utils/
    └── asyncHandler.test.ts
```

**Testing frameworks:**
- Jest or Vitest for test runner
- Supertest for HTTP endpoint testing
- Sinon for mocking viem/Supabase calls

### 8.2 Integration Tests

**Test scenarios:**

1. **Contract Sync Flow**
   - Deploy contract via frontend
   - Verify backend receives event
   - Verify Supabase updated
   - Verify frontend reflects changes

2. **Cron Job Execution**
   - Mock time to trigger cron
   - Verify contracts synced
   - Verify error handling

3. **Event Listener Reconnection**
   - Simulate RPC failure
   - Verify reconnection with exponential backoff
   - Verify events not missed

4. **Error Handling**
   - Invalid contract address
   - Blockchain RPC down
   - Supabase connection failure
   - Verify graceful degradation

### 8.3 Manual Testing Checklist

```
✅ Backend Startup
  ✅ Server starts on correct port
  ✅ Environment validation catches missing vars
  ✅ Cron jobs registered
  ✅ Event listeners started
  ✅ No errors in startup logs

✅ API Endpoints
  ✅ GET /health returns 200
  ✅ POST /api/contracts/sync with valid address returns contract
  ✅ POST /api/contracts/sync without address returns 400
  ✅ POST /api/contracts/sync with invalid address returns 500

✅ Event Listeners
  ✅ ContractDeployed event triggers sync
  ✅ New contract appears in Supabase immediately
  ✅ Event listener recovers from RPC failures

✅ Cron Jobs
  ✅ syncContractsJob runs every 5 minutes
  ✅ releaseRentJob runs every hour
  ✅ Failed syncs logged but don't crash job
  ✅ Successful syncs update last_synced_at

✅ Frontend Integration
  ✅ useContractSync hook calls backend
  ✅ Loading/error states work correctly
  ✅ Contract appears in dashboard after sync
  ✅ No CORS errors in browser console

✅ Error Handling
  ✅ Async route errors caught by middleware
  ✅ Blockchain errors logged with details
  ✅ Supabase errors logged with code/message/details
  ✅ 500 errors don't expose stack traces in production

✅ Graceful Shutdown
  ✅ SIGTERM stops server gracefully
  ✅ SIGINT (Ctrl+C) stops server gracefully
  ✅ In-flight requests complete before shutdown
  ✅ Force shutdown after 10s timeout
```

---

## 9. Deployment Guide

### 9.1 Development Environment

**Two-process setup:**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Environment files:**
- `backend/.env` - Backend config
- `frontend/.env.local` - Frontend config (with `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`)

### 9.2 Production Deployment

#### Option A: Monolithic Deployment (Same Server)

**Use PM2 for process management:**

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
npm run build
pm2 start dist/index.js --name civitas-backend

# Start frontend
cd frontend
npm run build
pm2 start npm --name civitas-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

**Environment:**
- Backend: `PORT=3001`, `NODE_ENV=production`
- Frontend: `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`

#### Option B: Separate Servers

**Backend: Deploy to Railway/Render/Fly.io**

```bash
# Example: Railway deployment
cd backend
railway up

# Set environment variables in Railway dashboard:
# - All vars from backend/.env
# - NODE_ENV=production
```

**Frontend: Deploy to Vercel**

```bash
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
# - All other frontend env vars
```

#### Option C: Docker Compose

**`docker-compose.yml`** (root of project):

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - BASE_RPC_URL=${BASE_RPC_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - FACTORY_ADDRESS=${FACTORY_ADDRESS}
      - KEEPER_PRIVATE_KEY=${KEEPER_PRIVATE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:3001
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
    depends_on:
      - backend
    restart: unless-stopped
```

**`backend/Dockerfile`**:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

**`frontend/Dockerfile`**:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy:**

```bash
docker-compose up -d
```

### 9.3 Environment Variables (Production)

**Backend:**
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://civitas.app

BASE_RPC_URL=https://mainnet.base.org
FACTORY_ADDRESS=0x...

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

KEEPER_PRIVATE_KEY=0x...  # CRITICAL: Use secret management (AWS Secrets Manager, etc.)
```

**Frontend:**
```bash
NODE_ENV=production

NEXT_PUBLIC_BACKEND_URL=https://api.civitas.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

### 9.4 Security Checklist (Production)

```
✅ Environment Variables
  ✅ SUPABASE_SERVICE_ROLE_KEY never exposed to client
  ✅ KEEPER_PRIVATE_KEY stored in secret management system
  ✅ No sensitive vars in frontend build

✅ CORS
  ✅ Origin restricted to production frontend URL
  ✅ Credentials enabled only for trusted origins

✅ Rate Limiting
  ⚠️ TODO: Add rate limiting to backend API (express-rate-limit)

✅ Error Handling
  ✅ Stack traces hidden in production (NODE_ENV=production)
  ✅ Operational errors distinguished from programming errors
  ✅ All errors logged with context

✅ Database
  ✅ RLS policies enabled on all tables
  ✅ Service role key only used server-side
  ✅ SQL injection protection in place

✅ Blockchain
  ✅ RPC URL uses HTTPS
  ✅ Private key never logged
  ✅ Transaction errors handled gracefully

✅ Monitoring
  ⚠️ TODO: Add application monitoring (Sentry, LogRocket)
  ⚠️ TODO: Add uptime monitoring (UptimeRobot, Pingdom)
```

---

## 10. Appendix

### 10.1 Package.json Files

**`backend/package.json`**:

```json
{
  "name": "civitas-backend",
  "version": "1.0.0",
  "description": "Civitas backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "test": "jest"
  },
  "type": "commonjs",
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "node-cron": "^3.0.3",
    "viem": "^2.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^25.2.0",
    "@types/node-cron": "^3.0.11",
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

**`backend/tsconfig.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**`backend/nodemon.json`**:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

### 10.2 Required npm Packages

**Backend:**
```bash
# Core
npm install express cors dotenv

# Blockchain
npm install viem@2

# Database
npm install @supabase/supabase-js @supabase/ssr

# Cron
npm install node-cron

# Dev dependencies
npm install -D typescript @types/node @types/express @types/cors @types/node-cron
npm install -D nodemon ts-node tsconfig-paths
```

**Frontend (additions only):**
```bash
# No new dependencies needed - just update hooks to call backend
```

### 10.3 Troubleshooting

**Issue: Symlink not working**

```bash
# Windows: Use mklink instead
mklink /D backend\src\lib ..\..\frontend\src\lib

# Alternative: Copy files instead of symlink
cp -r frontend/src/lib/supabase backend/src/lib/
```

**Issue: Module not found errors**

```bash
# Ensure tsconfig paths are set up
npm install -D tsconfig-paths

# Update nodemon.json to use tsconfig-paths
{
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

**Issue: Event listener stops working**

Check logs for:
- RPC connection errors
- Max retries exceeded
- Restart backend to reset retry counter

**Issue: Cron jobs not running**

Verify:
- Server started successfully (check "Cron jobs registered" log)
- System time is correct
- No timezone mismatches

**Issue: CORS errors from frontend**

Check:
- `FRONTEND_URL` in backend env matches actual frontend URL
- Backend CORS middleware allows origin
- Credentials flag set correctly

### 10.4 Monitoring & Observability

**Recommended tools:**

1. **Logging**: Winston or Pino (structured JSON logs)
2. **Error tracking**: Sentry
3. **Uptime monitoring**: UptimeRobot or Pingdom
4. **APM**: New Relic or Datadog
5. **Database monitoring**: Supabase built-in analytics

**Key metrics to track:**

- Backend uptime
- API response times
- Cron job success rate
- Event listener reconnection frequency
- Contract sync failures
- Blockchain RPC errors
- Database query performance

### 10.5 Future Enhancements

**Phase 2 (Post-Hackathon):**

1. **Rate Limiting**: Add express-rate-limit to prevent abuse
2. **API Authentication**: Add API keys for external integrations
3. **WebSockets**: Real-time contract updates via Socket.io
4. **Queue System**: Use BullMQ for background job management
5. **GraphQL API**: Add GraphQL layer for flexible queries
6. **Caching**: Add Redis for contract state caching
7. **Metrics**: Expose Prometheus metrics endpoint
8. **Health Checks**: Advanced health checks (DB, RPC, Supabase)

**Phase 3 (Production Hardening):**

1. **Load Balancing**: Multiple backend instances behind load balancer
2. **Database Replicas**: Read replicas for Supabase
3. **Backup Strategy**: Automated database backups
4. **Disaster Recovery**: Multi-region deployment
5. **Security Audit**: Third-party security review
6. **Performance Testing**: Load testing with k6 or Artillery
7. **CI/CD Pipeline**: Automated testing and deployment
8. **Documentation**: OpenAPI/Swagger docs for API

---

## Summary

This migration plan transforms Civitas from a serverless-only architecture to a hybrid system:

- **AI endpoints** stay in Next.js edge runtime (optimal for streaming)
- **Data operations** move to Express backend (enables cron, events, WebSockets)
- **Code reuse** via symlinks (no duplication of Supabase logic)
- **Clean separation** of concerns (frontend UI, backend services, AI processing)

**Key Benefits:**
✅ Automated rent release (no manual intervention)
✅ Real-time blockchain event processing
✅ Periodic contract syncing (always up-to-date)
✅ Foundation for future features (webhooks, queues, WebSockets)
✅ Better organization and maintainability

**Migration Time Estimate:**
- Setup: 30 minutes
- Implementation: 3-4 hours
- Testing: 1-2 hours
- **Total: ~5-6 hours**

**Next Steps:**
1. Review this plan
2. Execute Phase 1 (Backend Setup)
3. Execute Phase 2 (Implementation)
4. Execute Phase 3 (Frontend Changes)
5. Execute Phase 4 (Testing)
6. Deploy to production

---

**Document Status**: ✅ Ready for Implementation
**Last Updated**: 2026-02-02
**Version**: 1.0
