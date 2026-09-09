// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal read surface from https://eips.ethereum.org/EIPS/eip-8004.
interface IReputationRegistry {
    function getSummary(
        uint256 agentId,
        address[] calldata clientAddresses,
        string calldata tag1,
        string calldata tag2
    ) external view returns (uint64 count, int128 summaryValue, uint8 summaryValueDecimals);
}
