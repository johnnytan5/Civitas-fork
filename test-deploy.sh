#!/bin/bash

# Test deployment script to debug Base Mainnet transaction broadcasting
# This bypasses the frontend/wagmi/wallet entirely to test if the RPC works

set -e  # Exit on error

echo "========================================="
echo "BASE MAINNET DEPLOYMENT TEST"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f "contracts/.env" ]; then
    echo "❌ Error: contracts/.env not found"
    exit 1
fi

# Source the environment variables
source contracts/.env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in contracts/.env"
    exit 1
fi

echo "📋 Configuration:"
echo "   RPC: ${BASE_MAINNET_RPC_URL:-https://mainnet.base.org}"
echo "   Factory: 0xAF4D13Cac35b65d24203962fF22Dc281f1C1Fc5C"
echo ""

# Set the RPC URL (default to public if not set)
RPC_URL="${BASE_MAINNET_RPC_URL:-https://mainnet.base.org}"

echo "🔍 Testing RPC connection..."
BLOCK=$(cast block-number --rpc-url "$RPC_URL" 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ RPC connected! Current block: $BLOCK"
else
    echo "❌ RPC connection failed:"
    echo "$BLOCK"
    exit 1
fi

echo ""
echo "🔍 Checking deployer address..."
DEPLOYER=$(cast wallet address --private-key "$PRIVATE_KEY" 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Deployer address: $DEPLOYER"
else
    echo "❌ Failed to derive address from private key"
    exit 1
fi

echo ""
echo "🔍 Checking deployer balance..."
BALANCE=$(cast balance "$DEPLOYER" --rpc-url "$RPC_URL" 2>&1)
if [ $? -eq 0 ]; then
    BALANCE_ETH=$(cast --to-unit "$BALANCE" ether)
    echo "✅ Deployer balance: $BALANCE_ETH ETH"

    # Check if balance is sufficient (at least 0.001 ETH for gas)
    if [ $(echo "$BALANCE_ETH < 0.001" | bc) -eq 1 ]; then
        echo "⚠️  Warning: Low balance, may not have enough for gas"
    fi
else
    echo "❌ Failed to check balance:"
    echo "$BALANCE"
    exit 1
fi

echo ""
echo "🔍 Checking factory contract..."
FACTORY_CODE=$(cast code 0xAF4D13Cac35b65d24203962fF22Dc281f1C1Fc5C --rpc-url "$RPC_URL" 2>&1)
if [ ${#FACTORY_CODE} -gt 4 ]; then
    echo "✅ Factory contract exists at 0xAF4D13Cac35b65d24203962fF22Dc281f1C1Fc5C"
else
    echo "❌ Factory contract not found:"
    echo "$FACTORY_CODE"
    exit 1
fi

echo ""
echo "========================================="
echo "DEPLOYING TEST CONTRACT VIA FOUNDRY"
echo "========================================="
echo ""
echo "This will:"
echo "1. Call the factory to deploy a StableAllowanceTreasury"
echo "2. Use the same RPC endpoint as your frontend"
echo "3. Broadcast the transaction directly (no wallet/wagmi)"
echo ""
echo "If this succeeds → Issue is in frontend/wagmi/wallet"
echo "If this fails → Issue is RPC endpoint"
echo ""
read -p "Press Enter to continue..."

# Run the test deployment script
cd contracts
forge script script/TestDeploy.s.sol:TestDeploy \
    --rpc-url "$RPC_URL" \
    --broadcast \
    --slow \
    -vvv

echo ""
echo "========================================="
echo "DEPLOYMENT COMPLETE"
echo "========================================="
echo ""
echo "✅ If you see a contract address above, the RPC works fine!"
echo "   → Issue is in your frontend/wagmi/wallet configuration"
echo ""
echo "❌ If deployment failed with 'transaction not found' or timeout:"
echo "   → Issue is the RPC endpoint (try Alchemy/Infura)"
echo ""
