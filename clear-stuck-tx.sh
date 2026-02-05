#!/bin/bash

# Clear stuck transaction by sending a replacement with higher gas

set -e

source contracts/.env

DEPLOYER=$(cast wallet address --private-key "$PRIVATE_KEY")
RPC_URL="$BASE_MAINNET_RPC_URL"

echo "========================================="
echo "CLEAR STUCK TRANSACTION"
echo "========================================="
echo ""
echo "Deployer: $DEPLOYER"
echo "RPC: $RPC_URL"
echo ""

# Check current nonce
NONCE=$(cast nonce "$DEPLOYER" --rpc-url "$RPC_URL")
echo "Current on-chain nonce: $NONCE"
echo ""

# Check pending transaction count
PENDING=$(cast nonce "$DEPLOYER" --rpc-url "$RPC_URL" pending 2>/dev/null || echo "$NONCE")
echo "Pending nonce: $PENDING"
echo ""

if [ "$NONCE" -lt "$PENDING" ]; then
    echo "⚠️  STUCK TRANSACTION DETECTED!"
    echo "   On-chain nonce: $NONCE"
    echo "   Pending nonce: $PENDING"
    echo "   Gap: $(($PENDING - $NONCE)) transaction(s) stuck"
    echo ""
    echo "To clear, we'll send a dummy transaction to yourself with higher gas"
    echo ""
    read -p "Press Enter to send replacement transaction..."

    # Send a tiny amount to yourself with higher gas to clear the stuck nonce
    BALANCE=$(cast balance "$DEPLOYER" --rpc-url "$RPC_URL")
    echo "Current balance: $(cast --to-unit $BALANCE ether) ETH"

    # Get current gas price and add 20%
    GAS_PRICE=$(cast gas-price --rpc-url "$RPC_URL")
    HIGHER_GAS=$(echo "$GAS_PRICE * 1.2 / 1" | bc)

    echo "Current gas price: $(cast --to-unit $GAS_PRICE gwei) gwei"
    echo "Using gas price: $(cast --to-unit $HIGHER_GAS gwei) gwei"
    echo ""

    # Send 0 ETH to self to clear the nonce
    echo "Sending replacement transaction..."
    TX=$(cast send "$DEPLOYER" \
        --value 0 \
        --gas-price "$HIGHER_GAS" \
        --private-key "$PRIVATE_KEY" \
        --rpc-url "$RPC_URL" 2>&1)

    if echo "$TX" | grep -q "0x"; then
        HASH=$(echo "$TX" | grep -o "0x[a-fA-F0-9]\{64\}" | head -1)
        echo "✅ Replacement transaction sent: $HASH"
        echo "🔗 View on BaseScan: https://basescan.org/tx/$HASH"
        echo ""
        echo "Waiting for confirmation..."
        sleep 5

        NEW_NONCE=$(cast nonce "$DEPLOYER" --rpc-url "$RPC_URL")
        echo "New on-chain nonce: $NEW_NONCE"

        if [ "$NEW_NONCE" -gt "$NONCE" ]; then
            echo "✅ SUCCESS! Nonce advanced from $NONCE to $NEW_NONCE"
        else
            echo "⏳ Transaction submitted, waiting for network confirmation..."
        fi
    else
        echo "❌ Failed to send replacement transaction:"
        echo "$TX"
    fi
else
    echo "✅ No stuck transactions detected"
    echo "   Nonce is synchronized: $NONCE"
fi

echo ""
echo "========================================="
