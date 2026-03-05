// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";
import "./IPriceManager.sol";

contract UsdPriceManager is IPriceManager{
    AggregatorV3Interface public immutable ETH_USD;

    constructor(address ethUsdFeed) {
        ETH_USD = AggregatorV3Interface(ethUsdFeed); // 用官方给的 proxy 地址
    }

    /// @return price  ETH/USD，带 feed 自己的 decimals
    /// @return decimals 该 feed 的小数位
    /// @return updatedAt 最近一次更新的时间戳
    function ethUsd()
        private
        returns (uint256 price, uint8 decimals, uint256 updatedAt)
    {
        decimals = ETH_USD.decimals();

        (
            uint80 roundId,
            int256 answer,
            , // startedAt
            uint256 _updatedAt,
            uint80 answeredInRound
        ) = ETH_USD.latestRoundData();
        return (uint256(answer), decimals, _updatedAt);
    }

    function ethAmountToUsd(
        uint256 ethAmountWei
    ) external  override returns (uint256 usd_1e18) {
        (uint256 price, uint8 decimals, ) = ethUsd();

        // ethAmountWei: ETH 数量（wei）
        // price: ETH/USD（decimals 位）
        usd_1e18 = (ethAmountWei * price) / (10 ** decimals);
    }
}
