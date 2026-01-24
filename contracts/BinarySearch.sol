// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
//题目描述：在一个有序数组中查找目标值
contract BinarySearch{

    function search(uint num) external pure returns(uint){
        uint[]  memory array = new uint[](10);
        uint  i =0;
        while(i < array.length){
            array[i]=i*2;
            i++;
        }
        return doSearch(array, num , 0, array.length-1);

    }

    function doSearch(uint[] memory array,uint num, uint startIndex, uint endIndex) private pure returns(uint index){
        console.log("startindex = ,endIndex=", startIndex, endIndex);

        if (startIndex > endIndex) {       
            return 0;
        }
        uint  i = (startIndex + endIndex)/2;
        console.log("i =, arry[i]=", i, array[i]);

        if (num == array[i]) {
            console.log("bingo:",i);
            return i;
        } 

        if (num > array[i]) {
            return doSearch(array, num,i+1, endIndex);
        }

        if (num < array[i]) {
            return doSearch(array, num, startIndex, i-1);
        }     
    }
}