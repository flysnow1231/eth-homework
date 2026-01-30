// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// 发起delegatecall的合约B
contract Thailand {
    uint public num;
    address public sender;

    event delegateCall(address _addr, bool success, bytes data);

    // 通过call来调用C的setVars()函数，将改变合约C里的状态变量
    function callSetVars(address _addr, uint _num) external payable{
        // call setVars()
        (bool success, bytes memory data) = _addr.call(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }

    // 通过delegatecall来调用C的setVars()函数，将改变合约B里的状态变量
    function delegatecallSetVars(address _addr, uint _num) external payable{
        // delegatecall setVars()
        (bool success, bytes memory data) = _addr.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }

    function getVars(address _addr) external  {
       (bool success, bytes memory data)  = _addr.delegatecall(
            abi.encodeWithSignature("getVar()")
        );
        emit delegateCall(_addr,success, data);
       
    }
}