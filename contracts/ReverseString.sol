// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//题目描述：反转一个字符串。输入 "abcde"，输出 "edcba"

contract ReverseString {

    function reverse(string calldata reverseString) external pure returns(string memory ){
        bytes memory outputbytes = bytes(reverseString);
        bytes1  tmp;
        uint length = outputbytes.length;
        for (uint i=0; i <= length/2; i++){
            if (i<length-i-1){
                tmp = outputbytes[i];
                outputbytes[i]=outputbytes[length-i-1];
                outputbytes[length-i-1] = tmp;
            }
        }
        string memory result = string(outputbytes);
        return result;
    }
}