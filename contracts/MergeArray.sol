// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
//题目描述：将两个有序数组合并为一个有序数组。
contract MergeArray {
    function merge() external pure  returns (uint[] memory) {
        uint[] memory a1 = new uint[](5);
        a1[0] = 1;
        a1[1] = 1;
        a1[2] = 1;
        a1[3] = 1;
        a1[4] = 1;
        uint[] memory a2 = new uint[](3);
        a2[0] = 2;
        a2[1] = 2;
        a2[2] = 2;
        uint[] memory result = doMerge(a1, a2);
        
        // for (uint i = 0; i < result.length; i++) {
        //         console.log("result[]=", i, result[i]);
        // }
        return result;
        
    }
    event Debug(string tag, uint256 index, uint256 value);

    function doMerge(
        uint[] memory array1,
        uint[] memory array2
    ) private  pure returns (uint[] memory) {
        uint a1 = array1.length;
        uint a2 = array2.length;
        uint k = 0;
        uint j = 0;
        // uint leftArray = 0;
        uint i = 0;
        uint[] memory  mergedArray = new uint[](a1 + a2);

        while(k<a1&&j<a2){
            if(array1[k]<array2[j]){
                mergedArray[i++] = array1[k++];
            }else{
                mergedArray[i++] = array2[j++];
            }
        }

        while(k<a1){
            mergedArray[i++] = array1[k++];
        }

        while(j<a2){
            mergedArray[i++] = array2[j++];
        }
        
        //uint  compareEndIndex = array1.length<array2.length ? array1.length :array2.length;

        // for (uint i = 0; i < mergedArray.length; i++) {
        //     if (array1[k] > array2[j]) {
        //         mergedArray[i] = array2[j];
        //         j++;
        //         if (j == a2) {
        //             leftArray = 1;
        //             break;
        //         }
        //     } else {
        //         mergedArray[i] = array1[k];
        //         k++;
        //         if (k == a1) {
        //             leftArray = 2;
        //             break;
        //         }
        //     }
        // }

        // if (leftArray == 1) {
        //     uint  x=1;
        //     for (uint i = a1 - 1; i >= k; i--) {
        //         mergedArray[a1 + a2 - x] = array1[i];
        //          x++;
        //     }
        // }

        // if (leftArray == 2) {
        //     uint  x=1;
        //     for (uint i = a2; i > j; i--) {
        //         console.log("j =", j);
        //         console.log("i =", i);
        //         console.log("x =", x);
        //         console.log("a1 + a2 - x=", a1 + a2 - x);
        //         mergedArray[a1 + a2 - x] = array2[i-1];
        //         console.log("mergedArray =", mergedArray[a1 + a2 - x]);
        //         x++; 
        //     }
        // }
        // console.log("arry[0] =", mergedArray[0]);
        return mergedArray;
    }
}
