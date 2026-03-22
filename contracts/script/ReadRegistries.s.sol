// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";

contract ReadRegistries is Script {
    address constant BASE_SEPOLIA_IDENTITY = 0x8004A818BFB912233c491871b3d84c89A494BD9e;
    address constant BASE_SEPOLIA_REPUTATION = 0x8004B663056A597Dffe9eCcC1965A193B7388713;

    function run() external view {
        console2.log("Base Sepolia IdentityRegistry:", BASE_SEPOLIA_IDENTITY);
        console2.log("Base Sepolia ReputationRegistry:", BASE_SEPOLIA_REPUTATION);
    }
}
