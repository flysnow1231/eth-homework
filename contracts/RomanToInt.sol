// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
// 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。
// 字符          数值
// I             1
// V             5
// X             10
// L             50
// C             100
// D             500
// M             1000
// 例如， 罗马数字 2 写做 II ，即为两个并列的 1 。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。
// 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：
// I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
// X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
// C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
// 给定一个罗马数字，将其转换成整数。
// 示例 1:
// 输入: s = "III"
// 输出: 3
// 示例 2:
// 输入: s = "IV"
// 输出: 4
// 示例 3:

// 输入: s = "IX"
// 输出: 9
// 示例 4:

// 输入: s = "LVIII"
// 输出: 58
// 解释: L = 50, V= 5, III = 3.
// 示例 5:

// 输入: s = "MCMXCIV"
// 输出: 1994
// 解释: M = 1000, CM = 900, XC = 90, IV = 4.

// 提示：

// 1 <= s.length <= 15
// s 仅含字符 ('I', 'V', 'X', 'L', 'C', 'D', 'M')
// 题目数据保证 s 是一个有效的罗马数字，且表示整数在范围 [1, 3999] 内
// 题目所给测试用例皆符合罗马数字书写规则，不会出现跨位等情况。
// IL 和 IM 这样的例子并不符合题目要求，49 应该写作 XLIX，999 应该写作 CMXCIX 。

contract RomanToInt {
    mapping(string => uint256) romanToIntMap;

    constructor() {
        romanToIntMap["I"] = 1;
        romanToIntMap["V"] = 5;
        romanToIntMap["X"] = 10;
        romanToIntMap["L"] = 50;
        romanToIntMap["C"] = 100;
        romanToIntMap["D"] = 500;
        romanToIntMap["M"] = 1000;
    }
    //一般规律 + 特例
    function romanToInt(
        string calldata roman
    ) external view returns (bool, uint) {
        bytes memory romanBytes = bytes(roman);

        if (romanBytes.length < 1 || romanBytes.length > 15) {
            return (false, 0);
        }

        for (uint i = 0; i < romanBytes.length; i++) {
            if (romanToIntMap[byteToString(romanBytes[i])] == 0) {
                return (false, 0);
            }
        }

        uint num = 0;
        for (uint i = 0; i < romanBytes.length; i++) {
            console.log("num = ", uint8(num));
            console.log("romanBytes[i]=, i=, char=", uint8(romanBytes[i]), i);
            console.log("keccak256()", uint8(romanBytes[i]));

            if (bytes1("I") == romanBytes[i]) {
                console.log("meet I");
                if (i + 1 < romanBytes.length) {
                    if (romanBytes[i + 1] == bytes1("V")) {
                        console.log("meet IV");
                        num = num + 4;
                        i++;
                        continue;
                    }

                    if (romanBytes[i + 1] == bytes1("X")) {
                        num = num + 9;
                        i++;
                        continue;
                    }
                } 
            }

            if (bytes1("X") == romanBytes[i]) {
                if (i + 1 < romanBytes.length) {
                    if (romanBytes[i + 1] == bytes1("L")) {
                        num = num + 40;
                        i++;
                        continue;
                    }

                    if (romanBytes[i + 1] == bytes1("C")) {
                        num = num + 90;
                        i++;
                        continue;
                    }
                } 
            }

            if (bytes1("C") == romanBytes[i]) {
                if (i + 1 < romanBytes.length) {
                    if (romanBytes[i + 1] == bytes1("D")) {
                        num = num + 400;
                        i++;
                         continue;
                    }

                    if (romanBytes[i + 1] == bytes1("M")) {
                        num = num + 900;
                        i++;
                         continue;
                    }
                } 
            }
            //console.log("general condition:,char= , num=, toAdd=", byteToString(romanBytes[i]), uint8(num),uint8(romanToIntMap[byteToString(romanBytes[i])]));
             console.log("num:", num);

            num = num + romanToIntMap[byteToString(romanBytes[i])];
            console.log("num:", num);
           
        }

        return (true, num);
    }

    function byteToString(bytes1 b) internal pure returns (string memory) {
        bytes memory tmp = new bytes(1);
        tmp[0] = b;
        return string(tmp);
    }

    function equal(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}
