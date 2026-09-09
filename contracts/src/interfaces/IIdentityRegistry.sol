// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal read surface from https://eips.ethereum.org/EIPS/eip-8004.
/// Agent IDs are ERC-721 token IDs, not bytes32 identifiers.
interface IIdentityRegistry {
    function ownerOf(uint256 agentId) external view returns (address);
    function tokenURI(uint256 agentId) external view returns (string memory);
    function getAgentWallet(uint256 agentId) external view returns (address);
}
