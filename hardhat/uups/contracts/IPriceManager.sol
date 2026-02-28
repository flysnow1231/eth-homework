// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IPriceManager {
   function ethAmountToUsd(
        uint256 ethAmountWei
    ) external   returns (uint256 usd_1e18);
}