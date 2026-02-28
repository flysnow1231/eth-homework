** 首次部署说明 **  
1.部署price feed 合约。执行deploy_UsdPriceManager.ts。  
2.部署aka implement合约，执行deploy_aka.ts。本工程核心业务合约，主要功能是nft管理，拍卖。  
3.部署代理合约,执行deploy_proxy.ts.  

** 升级流程 **  
升级原理，本工程使用UUPS代理。修改AkaNft代码后，编译部署后，将akanft新地址绑定至代理，实现升级。   
npx hardhat compile   
npx hardhat run scripts/deploy_Aka.ts --network sepolia  
npx hardhat run scripts/deploy_upgrade.ts --network sepolia  


** 常用命令 **  
npx hardhat compile
npx hardhat run scripts/interact.ts --network sepolia

npx hardhat run scripts/deploy_proxy.ts --network sepolia

npx hardhat run scripts/deploy_UsdPriceManager.ts --network sepolia
npx hardhat run scripts/deploy_Aka.ts --network sepolia
npx hardhat run scripts/deploy_upgrade.ts --network sepolia
rm -rf artifacts cache
npx hardhat clean
npx hardhat compile --force


0xbc63e9b8c7563afde3721F7fD1c40112d3b46AbF
0xcaA35614B6b8e1F1F0f4A668686A6242cf6067F5