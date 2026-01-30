// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import './OtherContract.sol';

contract CallOtherContract {
    function callSetX(address add, uint amount) external  payable {
        OtherContract(add).setX(amount);
    }

    function callSet(OtherContract _Address, uint amount) external payable {
        _Address.setX(amount);
    }

    function callGetX(address add) external  view returns (uint) {
        return OtherContract(add).getX();
    }
}