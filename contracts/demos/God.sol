// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract God {
    event log(string msg);

    function hip() public virtual {
        emit log("god hip() is called");
    }
}

contract Adam is God {
    function hip() public virtual override {
        emit log("Adam hip() is called");
        super.hip();
    }
}

contract Eve is God {
    function hip() public virtual override {
        emit log("eve hip() is called");
        super.hip();
    }
}

contract People is Adam, Eve {
    function hip() public override(Adam, Eve) {
        emit log("people hip() is called");
        super.hip();
    }
}
