#!/usr/bin/env bash
# Deploy Soroban contracts to Stellar Testnet
# Required env vars:
#   STELLAR_SECRET_KEY       - deployer account secret key
#   NEXT_PUBLIC_HORIZON_URL  - Horizon endpoint (default: https://horizon-testnet.stellar.org)
#   NEXT_PUBLIC_NETWORK_PASSPHRASE - network passphrase (default: Test SDF Network ; September 2015)

set -euo pipefail

HORIZON_URL="${NEXT_PUBLIC_HORIZON_URL:-https://horizon-testnet.stellar.org}"
NETWORK_PASSPHRASE="${NEXT_PUBLIC_NETWORK_PASSPHRASE:-Test SDF Network ; September 2015}"
RPC_URL="${SOROBAN_RPC_URL:-https://soroban-testnet.stellar.org}"

if [[ -z "${STELLAR_SECRET_KEY:-}" ]]; then
  echo "Error: STELLAR_SECRET_KEY is required" >&2
  exit 1
fi

CONTRACTS_DIR="$(cd "$(dirname "$0")/../contracts" && pwd)"

echo "==> Building contracts..."
(cd "$CONTRACTS_DIR" && soroban contract build)

PAYMENT_WASM="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/payment.wasm"
ESCROW_WASM="$CONTRACTS_DIR/target/wasm32-unknown-unknown/release/escrow.wasm"

echo "==> Deploying PaymentContract..."
PAYMENT_CONTRACT_ID=$(soroban contract deploy \
  --wasm "$PAYMENT_WASM" \
  --source "$STELLAR_SECRET_KEY" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE")

echo "PaymentContract deployed: $PAYMENT_CONTRACT_ID"

echo "==> Deploying EscrowContract..."
ESCROW_CONTRACT_ID=$(soroban contract deploy \
  --wasm "$ESCROW_WASM" \
  --source "$STELLAR_SECRET_KEY" \
  --rpc-url "$RPC_URL" \
  --network-passphrase "$NETWORK_PASSPHRASE")

echo "EscrowContract deployed: $ESCROW_CONTRACT_ID"

echo ""
echo "==> Deployment complete. Add these to your .env.local:"
echo "NEXT_PUBLIC_PAYMENT_CONTRACT_ID=$PAYMENT_CONTRACT_ID"
echo "NEXT_PUBLIC_ESCROW_CONTRACT_ID=$ESCROW_CONTRACT_ID"
echo "NEXT_PUBLIC_HORIZON_URL=$HORIZON_URL"
echo "NEXT_PUBLIC_NETWORK_PASSPHRASE=$NETWORK_PASSPHRASE"
