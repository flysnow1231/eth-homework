// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Pataya {
    uint public num;
    address public sender;

    function setVars(uint _num) public payable {
        num = _num;
        sender = msg.sender;
    }

    function getVar() public view returns(uint) {
        return num;
    }


}