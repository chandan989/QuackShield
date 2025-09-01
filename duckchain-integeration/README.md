# DuckChain Integration

This directory contains the complete DuckChain blockchain integration for the QuackNet Framework.

## Overview

The DuckChain integration provides blockchain functionality for the QuackNet multi-agent moderation framework, including wallet connection, appeal submission, transaction management, and on-chain voting capabilities.

## Directory Structure

```
duckchain-integeration/
├── README.md                 # This documentation file
├── types/
│   └── blockchain.ts         # TypeScript types for blockchain operations
├── utils/
│   └── duckchain.ts         # Core DuckChain service implementation
└── hooks/
    └── useDuckChain.ts      # React hook for DuckChain integration
```

## Files Description

### types/blockchain.ts
Contains all TypeScript type definitions for the DuckChain integration:
- `DuckChainConnection` - Connection state and wallet info
- `AppealTransaction` - Appeal submission and voting data
- `Transaction` - Generic blockchain transaction structure
- `DuckChainError` - Custom error handling for blockchain operations
- Various enums for connection status, transaction status, and appeal status

### utils/duckchain.ts
Core service implementation providing:
- Wallet connection and disconnection
- Appeal submission with staking mechanism
- Transaction management and confirmation
- Mock DuckChain testnet simulation
- Event listeners for connection state changes
- Utility functions for balance formatting and address validation

### hooks/useDuckChain.ts
React hook that provides:
- Connection state management
- Wallet information (address, balance)
- Appeal submission functionality
- Error handling and state updates
- Formatted display values for UI components

## Key Features

1. **Wallet Integration**: Connect/disconnect wallet functionality with balance tracking
2. **Appeal System**: Submit moderation appeals with $DUCK token staking
3. **Transaction Management**: Track appeal transactions and their status
4. **Mock Blockchain**: Simulated DuckChain testnet for development and testing
5. **Error Handling**: Comprehensive error types and user-friendly error messages
6. **React Integration**: Easy-to-use React hook for frontend components

## Usage in QuackNet Framework

This integration is currently used in the main QuackNet application (`quack-shield-app`) to provide:
- On-chain appeal submission for moderation decisions
- Wallet connection status in the UI header
- Appeal modal with blockchain interaction
- Real-time balance and address display

## Configuration

The integration uses a mock DuckChain testnet configuration:
- Chain ID: 6969
- Staking Amount: 50 $DUCK tokens
- Voting Period: 24 hours
- Mock RPC URL and contract address

## Development Notes

This is a demonstration implementation using simulated blockchain interactions. In production, this would connect to actual DuckChain network infrastructure and real smart contracts.