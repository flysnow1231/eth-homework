// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

contract Proxy {
    address public implementation; // 逻辑合约地址
    address public admin; // admin地址
    string public words; // 字符串，可以通过逻辑合约的函数改变

    // 构造函数，初始化admin和逻辑合约地址
    constructor(address _implementation){
        admin = msg.sender;
        implementation = _implementation;
    }

    // fallback函数，将调用委托给逻辑合约
    fallback() external payable {
        (bool ok, bytes memory data) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    
    }

    function getWord() public view returns(string memory){
        return words;
    }
}