// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "hardhat/console.sol";

contract Begging{
    mapping (address=>uint) donorAmountMapping;
    event donateEvent(address, uint);
    event Withdraw(address, uint);
    address[]  topDonors;

    address public  owner;
    uint timeLimit;

    constructor(uint duration){
        owner= msg.sender;
        timeLimit = block.timestamp + duration;
    }
 

    modifier onlyOwner(){
        require(msg.sender==owner, "only owner");
        _;
    }

    modifier timeLimitModify(){
        require(block.timestamp < timeLimit, "expired donate time");
        _;
    }

    function donate() external payable timeLimitModify{
        require(msg.value > 0,"no eth sent");
        console.log("donote start");
        donorAmountMapping[msg.sender]=msg.value+ donorAmountMapping[msg.sender];
        emit donateEvent(msg.sender, msg.value);
        _updateTop3(msg.sender);


    }

    function withdraw() external  onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0,"no eth");

        console.log("withdraw amount=", amount);
        (bool success, ) =  payable(owner).call{value:amount}("");
        console.log("result:",success);
        emit Withdraw(owner, amount);
        require(success, "withdraw failed");

    }

    function getDonation(address donorAddress) external view returns(uint){
        return donorAmountMapping[donorAddress];
    }

    function getBalance()external  view returns(uint){
        return address(this).balance;
    }

    function _updateTop3(address donor)   internal {
        uint256 amount = donorAmountMapping[donor];
        console.log("donor= , amount=", donor, amount);
        if(topDonors.length==0){
            console.log("top 0");
            topDonors.push(donor);
            return;
        }

        // 1. 已经在榜上 → 更新金额
        for (uint256 i = 0; i < topDonors.length; i++) {
            if (topDonors[i] == donor) {
                console.log("top 1");
                donorAmountMapping[donor] = amount;
                _sortTop3();
                return;
            }
        }
        console.log("s1 pass");
        // 2. 榜单未满（<3）→ 直接插入
        if (topDonors.length < 3) {
            topDonors.push(donor);
            _sortTop3();
            return;
        }
        console.log("s2 pass");
        // 3. 榜单已满 → 是否超过第3名
        address lastAddress = topDonors[2];
        if (amount > donorAmountMapping[lastAddress]) {
            topDonors[2] = donor;
            _sortTop3();
        }
    }

    function _sortTop3() internal {
        uint topSize = topDonors.length;
        // 只对 [0, topSize) 排序
        for (uint256 i = 0; i < topSize; i++) {
            for (uint256 j = i + 1; j < topSize; j++) {
                if (donorAmountMapping[topDonors[j]]>donorAmountMapping[topDonors[i]]) {
                    (topDonors[i], topDonors[j]) =
                        (topDonors[j], topDonors[i]);
                }
            }
        }
    }

    function getTop3() external view returns( address[] memory){
        return topDonors;
    }
}