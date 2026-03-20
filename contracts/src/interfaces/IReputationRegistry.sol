// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IReputationRegistry {
    function getReputation(address agent, address reviewer) external view returns (uint256 score, string memory metadataURI);
}
