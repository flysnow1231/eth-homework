// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// 一个mapping来存储候选人的得票数
// 一个vote函数，允许用户投票给某个候选人
// 一个getVotes函数，返回某个候选人的得票数
// 一个resetVotes函数，重置所有候选人的得票数

contract VoteContract {
     
    mapping(string => uint256) private  voteResult;  
    mapping(string => bool) private  canditates; 
    mapping(string => uint256) private  voteRoundMap;  

    uint256 private voteRound;

    constructor(){
        addCandidate("lingdan");
        addCandidate("lizongwei");
        
    }
 

    // 投票
    function vote(string memory  name)  external returns(bool ) {
       require(bytes(name).length != 0, "name can not be empty");
        
       if (!canditates[name]) {
        return false;
       }
      
      if (voteRoundMap[name] != voteRound) {
            voteRoundMap[name] = voteRound;
            voteResult[name]=0;
       }

        voteResult[name]+=1;
      
        return true;
    }

     // 投票
    function addCandidate(string memory  name)  internal  {
        //require(name.length != 0`,"name can not be empty")    
        voteResult[name]=0;
        canditates[name] = true;
        voteRoundMap[name]=voteRound;
    }

    //取得
    function getVotes(string calldata name) external   returns(uint ){
        require(canditates[name],"canditates is not exist");
         if (voteRoundMap[name] != voteRound) {
            voteRoundMap[name] = voteRound;
            voteResult[name]=0;
        }

        return voteResult[name];
    }

    //重置  
    function resetVotes() external   returns(bool ){
        voteRound ++;
        return true;
    }


}