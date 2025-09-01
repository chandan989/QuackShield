# 🦆🔗 DuckChain Integration Core

This module is the warp conduit to DuckChain—the on-chain substrate for staking, appeals, and governance. Here, messages leave the ship and become immutable star maps on the ledger.

## Directory Star Map

- hooks/
  - React/TypeScript hooks that expose wallet state, staking flows, and transaction lifecycle (pending → confirmed → failed).
- types/
  - Types for addresses, token units, transaction receipts, and governance payloads.
- utils/
  - Chain RPC clients, ABI bindings, gas estimators, and formatting helpers.

## Functional Systems

- Staking & Appeals
  - Stake $DUCK to initiate an appeal
  - Query appeal status, tally votes, and surface verdicts to UI

- Wallet & Session
  - Connect/disconnect wallet
  - Handle chain switching and unsupported networks gracefully

- Transactions
  - Prepare, simulate, submit, and monitor TXs
  - Exponential backoff with user-friendly toasts

## Example Hyperlane (Pseudo)

```ts
const { connect, stakeForAppeal, getAppeal } = useDuckChain();
await connect();
const tx = await stakeForAppeal({ messageId, amount: toDUCK(50) });
await tx.wait();
const appeal = await getAppeal(messageId);
renderAppeal(appeal);
```

## Configuration

- Environment
  - DUCKCHAIN_RPC_URL
  - DUCKCHAIN_CONTRACT_MODERATION
  - DUCKCHAIN_CHAIN_ID
- Security
  - Never store private keys; rely on wallet providers
  - Validate chain ID before sending transactions

## Failure Modes

- RPC timeouts → auto-retry and suggest alternative endpoints
- Nonce conflicts → resync account state
- Reorgs → re-validate finality before closing UI flows

## When To Use

- Any on-chain action: staking, voting, resolving appeals, querying governance

> Status: Critical systems. Without this core, appeals remain in simulation.
