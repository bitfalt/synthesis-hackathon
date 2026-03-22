// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IIdentityRegistry {
    function getAgent(bytes32 agentUid) external view returns (address owner, string memory agentURI);
}
