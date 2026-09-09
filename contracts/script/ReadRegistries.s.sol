// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Reports configured addresses only; does not verify live registry state.
contract ReadRegistries {
    function run() external pure returns (address identityRegistry, address reputationRegistry) {
        return (0x8004A818BFB912233c491871b3d84c89A494BD9e, 0x8004B663056A597Dffe9eCcC1965A193B7388713);
    }
}
