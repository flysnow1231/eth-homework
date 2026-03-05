// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../IPriceManager.sol";

contract MockPriceManager is IPriceManager {
    uint256 private _price;
    uint8 private _decimals;

    constructor(uint256 price_, uint8 decimals_) {
        _price = price_;
        _decimals = decimals_;
    }

   
    function ethAmountToUsd(
        uint256 ethAmountWei
    ) external  override returns (uint256 usd_1e18) {
        // ethAmountWei: ETH 数量（wei）
        // price: ETH/USD（decimals 位）
        usd_1e18 = (ethAmountWei * _price) / (10 ** _decimals);
    }
        
}