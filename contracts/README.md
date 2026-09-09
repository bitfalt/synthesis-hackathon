# Aegis Onchain Workspace

This Foundry workspace is the starting point for ERC-8004 / Base Sepolia integration.

Current goal:
- keep custom contract surface minimal
- anchor the repo around the ERC-8004 registries first
- avoid overbuilding before the vertical slice works

Known Base Sepolia addresses:
- IdentityRegistry: 0x8004A818BFB912233c491871b3d84c89A494BD9e
- ReputationRegistry: 0x8004B663056A597Dffe9eCcC1965A193B7388713

## Build and scope

Run `cd contracts && forge build` with Foundry installed. No forge-std dependency is
required. `forge script script/ReadRegistries.s.sol:ReadRegistries` returns the two
configured addresses locally; it does not query a chain or broadcast a transaction.

The interfaces expose a minimal read-only subset of [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004),
using uint256 agent IDs and signed reputation values. They do not implement registries.
Verify deployed code and the network before using these configured addresses.
Agent registration, signed receipts and UI integration remain pending in the main
application's existing readiness documentation; this scaffold does not complete them.
