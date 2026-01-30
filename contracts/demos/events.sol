// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract events{
    mapping(address=>uint) balances;

    event transfer(address from , address to, uint amount);

    function transferBalance(address from, address to, uint amount) external {
        balances[from] = 1000000;
        balances[to] +=  amount;
        balances[from] -= amount;

        emit transfer(from, to, amount);

    }

}
