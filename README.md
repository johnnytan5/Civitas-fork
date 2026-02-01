# Civitas - AI-Powered Cross-Chain Rental Agreements

**"The first AI Agent that negotiates, deploys, and funds cross-chain agreements in a single click."**

Civitas is an AI-powered platform that enables users to create rental agreements on the blockchain by simply chatting with an AI. The system handles natural language processing, smart contract deployment, and cross-chain funding automatically.

Built for **ETH HackMoney 2026** - targeting:
- 🏆 **Best AI x LI.FI Smart App** ($2,000)
- 🏆 **Most Creative Use of ENS for DeFi** ($1,500)

---

## 🌟 Key Features

### Three Core Pillars

1. **Logic (AI)** - Gemini 2.0 Flash converts natural language to smart contract configuration
2. **Liquidity (LI.FI)** - Cross-chain bridging from any token on any chain to Base USDC
3. **Identity (ENS/Basenames)** - Human-readable contract addresses (e.g., `downtown-studio-6mo.civitas.base.eth`)

### Smart Contract Features

- ✅ **Balance-Based Activation** - Handles async LI.FI funding without explicit deposit function
- ✅ **Permissionless Rent Release** - Anyone can trigger rent payments (no keeper needed)
- ✅ **CREATE2 Deployment** - Deterministic addresses enable LI.FI pre-funding
- ✅ **30-Day Termination Notice** - Fair early termination with pro-rata refunds
- ✅ **Security Hardened** - ReentrancyGuard, SafeERC20, hardcoded USDC

### Frontend Features

- ✅ **Streaming Chat Interface** - Real-time AI conversation with Gemini
- ✅ **Auto-Config Extraction** - Automatically extracts tenant, amount, duration
- ✅ **Real-Time Preview** - Contract card updates as you chat
- ✅ **Split-Screen Layout** - Chat on left, preview on right
- ✅ **Dashboard** - View all rental agreements with status tracking

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  Next.js 15 + React Server Components + RainbowKit v2           │
├─────────────────────────────────────────────────────────────────┤
│  /create      → Split-screen chat + contract preview            │
│  /dashboard   → Contract list with state tracking               │
│  /api/chat    → Streaming chat with Gemini 2.0 Flash           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SMART CONTRACTS (Base L2)                      │
├─────────────────────────────────────────────────────────────────┤
│  RentalFactory.sol                                               │
│  ├── deployRental() → CREATE2 + Minimal Proxy (EIP-1167)       │
│  ├── predictRentalAddress() → Deterministic address calc        │
│  └── Emits RentalDeployed event                                 │
│                                                                  │
│  RecurringRent.sol (Implementation)                              │
│  ├── States: Deployed → Active → Completed/Terminated           │
│  ├── Balance-based activation (handles async funding)           │
│  ├── Permissionless rent release                                 │
│  └── Early termination with 30-day notice                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Foundry (for smart contracts)
- Gemini API key
- WalletConnect project ID

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/civitas.git
cd civitas

# Install frontend dependencies
cd frontend
pnpm install

# Install contract dependencies
cd ../contracts
forge install
```

### Environment Setup

**Frontend (.env.local):**
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
# AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Wallet
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# RPC
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth.llamarpc.com

# Contracts (after deployment)
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_RENTAL_IMPLEMENTATION=0x...
```

**Contracts (.env):**
```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

### Development

**Frontend:**
```bash
cd frontend
pnpm dev
# Opens at http://localhost:3000
```

**Smart Contracts:**
```bash
cd contracts

# Run tests
forge test -vv

# Deploy to Base Sepolia (testnet)
source .env
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify

# Deploy to Base Mainnet
forge script script/Deploy.s.sol --rpc-url base --broadcast --verify
```

---

## 📖 Usage Guide

### Creating a Rental Agreement

1. **Connect Wallet** - Click "Connect Wallet" and select your wallet
2. **Start Chat** - Navigate to `/create` and describe your rental agreement
3. **AI Extracts Details** - Chat with AI to define tenant, monthly amount, and duration
4. **Review Preview** - Contract card updates in real-time as you chat
5. **Deploy** - Click "Sign & Fund" when config is complete
6. **Confirm Transactions** - Sign deployment transaction

### Example Conversation

```
You: I want to rent my apartment to bob.eth for 6 months at 1000 USDC per month

AI: Great! Let me confirm the details:
- Tenant: bob.eth
- Monthly rent: 1000 USDC
- Duration: 6 months
- Total amount: 6000 USDC

Is this correct?

You: Yes

AI: Perfect! Your rental agreement is ready to deploy. Click "Sign & Fund" to create it on-chain.
```

### Dashboard

View all your rental agreements at `/dashboard`:

- **Total Contracts** - See all deployed agreements
- **Active Contracts** - Currently running rentals
- **Completed Contracts** - Successfully finished agreements
- **Contract States**:
  - 🔴 **Ghost** - Deployed but not funded
  - 🟢 **Active** - Running normally
  - ✅ **Completed** - Successfully finished
  - 🟣 **Terminating** - In 30-day notice period
  - ⚫ **Terminated** - Early termination complete

---

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts

# Run all tests
forge test -vv

# Run specific test
forge test --match-test testDeployRental -vv

# Run with gas reporting
forge test --gas-report

# Run with coverage
forge coverage
```

**Test Results:**
```
RecurringRentTest
✓ testInitialization (7 tests, all passing)
✓ testActivationWhenFunded
✓ testReleaseRentAfterOneMonth
✓ testFinalizeTermination

RentalFactoryTest
✓ testDeployRental (3 tests, all passing)
✓ testPredictedAddressMatches
✓ testDifferentUsersGetDifferentAddresses
```

### Frontend Build

```bash
cd frontend

# Type checking
pnpm build

# This will show TypeScript errors if any exist
```

---

## 📂 Project Structure

```
civitas/
├── frontend/                    # Next.js 15 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── create/          # Split-screen chat interface
│   │   │   ├── dashboard/       # Contract list
│   │   │   └── api/             # API routes (chat, extract-config, generate-name)
│   │   ├── components/
│   │   │   ├── chat/            # ChatInterface
│   │   │   ├── contract/        # ContractCard
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── deploy/          # DeployModal
│   │   │   └── providers/       # Web3Provider
│   │   ├── hooks/               # useRentalChat, useContractDeploy
│   │   └── lib/
│   │       ├── ai/              # Schemas and prompts
│   │       ├── contracts/       # ABIs, constants, utilities
│   │       └── ens/             # ENS resolution
│   └── package.json
├── contracts/                   # Foundry smart contracts
│   ├── src/
│   │   ├── RecurringRent.sol   # Rental agreement implementation
│   │   └── RentalFactory.sol   # CREATE2 factory
│   ├── test/                    # Foundry tests
│   ├── script/                  # Deployment scripts
│   └── foundry.toml
└── docs/                        # Design and planning docs
```

---

## 🔑 Key Technical Decisions

### Why Balance-Based Activation?

**Problem:** LI.FI bridge transactions are async (1-5 min). If we require a specific `deposit()` function call, funds could arrive but activation could fail.

**Solution:** Contract checks `USDC.balanceOf(address(this)) >= required`. Doesn't matter HOW funds arrived - direct transfer, LI.FI bridge, or even airdrop.

### Why CREATE2?

**Problem:** Need to know contract address before deployment for LI.FI pre-funding.

**Solution:** CREATE2 provides deterministic addresses. Calculate address → fund via LI.FI → deploy to same address.

### Why Gemini 2.0 Flash?

- **Speed:** Flash-level latency for real-time chat
- **Cost:** $0.50 input / $3.00 output per 1M tokens
- **Structured Output:** Supports Zod schemas via Vercel AI SDK
- **Context:** 1M token window handles long conversations

---

## 📝 Smart Contract API

### RentalFactory

```solidity
function deployRental(
    address landlord,
    address tenant,
    uint256 monthlyAmount,
    uint8 totalMonths,
    string calldata suggestedName
) external returns (address rental)

function predictRentalAddress(
    address deployer,
    string calldata suggestedName
) external view returns (address)
```

### RecurringRent

```solidity
// State transitions
enum State { Deployed, Active, Completed, TerminationPending, Terminated }

// Core functions
function checkAndActivate() public
function releasePendingRent() external
function initiateTermination() external
function finalizeTermination() external

// View functions
function landlord() external view returns (address)
function tenant() external view returns (address)
function monthlyAmount() external view returns (uint256)
function totalMonths() external view returns (uint8)
function state() external view returns (State)
```

---

## 🔐 Security

### Audit Status

⚠️ **Not audited** - This is a hackathon project. Do not use in production without proper security audit.

### Security Features

- ✅ **ReentrancyGuard** - Prevents reentrancy attacks
- ✅ **SafeERC20** - Safe token transfers with proper error handling
- ✅ **Hardcoded USDC** - Prevents malicious token swaps
- ✅ **Immutable Implementation** - Factory implementation cannot be changed
- ✅ **Input Validation** - All parameters validated before deployment

### Known Limitations

- **No emergency pause** - Once active, contract cannot be paused
- **No dispute resolution** - Off-chain breaches cannot be handled on-chain
- **30-day termination** - Minimum notice period enforced
- **USDC only** - No support for other stablecoins or native ETH

---

## 🛣️ Roadmap

### Phase 2: Full R2F2C (AI-Generated FSM)
- AI generates state machine as JSON
- Backend validates for deadlocks
- Factory deploys from template library based on FSM

### Phase 3: Additional Templates
- **Escrow** - Simple two-party with arbiter
- **Payment Splitter** - Multi-party revenue share
- **Bet/Wager** - Conditional payout based on oracle

### Phase 4: Production Hardening
- Account abstraction for single-signature flows
- Gas sponsorship for better UX
- Subgraph for efficient contract indexing
- Multi-chain deployment (not just Base)

---

## 🤝 Contributing

This is a hackathon project. Contributions welcome after the competition!

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- [OpenZeppelin Contracts](https://www.openzeppelin.com/)
- [Foundry](https://book.getfoundry.sh/)
- [Next.js](https://nextjs.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Gemini](https://ai.google.dev/)
- [Base](https://base.org/)

---

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

**Built for ETH HackMoney 2026** 🚀
