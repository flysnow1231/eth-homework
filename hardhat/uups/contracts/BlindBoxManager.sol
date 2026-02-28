// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


/**
 * @title BlindBoxStorage
 * @dev 盲盒存储模块，定义盲盒相关的数据结构
 * @notice 这是一个存储库，用于定义数据结构
 */
 library BlindBoxManager{
    struct BlindBox {
        bool purchased;      // 是否已购买
        bool revealed;       // 是否已揭示
        uint256 purchaseTime; // 购买时间
        uint256 revealTime;   // 揭示时间
        bool    auctioned;
        bool    isEndActioned;
    }

    function createBlindBox() internal view returns(BlindBox memory){
          return BlindBox({
            purchased: true,
            revealed: false,
            purchaseTime: block.timestamp,
            revealTime: 0,
            auctioned:false,
            isEndActioned:false
        });
    }


 }