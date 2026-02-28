NFTAUCTION/
├── contracts/
│   ├── AkaNft.sol                     # 主合约
│   ├── BlindBoxManager.sol            # library, 定义肓盒结构体
│   ├── IPriceManager.sol              # 预言机接口，price feed功能
│   ├── UsdPriceManager.sol            # IPriceManager实现类，从chainlink的feed中拿到eth/usd实时价格
│   └── ProxyImprts.sol                # 项目importERC1967Proxy.sol
├── test/
│   └── NFTBlindBox.test.ts            # 测试文件
├── scripts/
│   ├── deploy_UsdPriceManager.ts      # 部署预言机合约
│   ├── deploy_aka.ts                  # 部署主合约
│   ├── deploy_proxy.ts                # 部署代理合约
│   └── deploy_upgrade.ts              # 升级部署
├── ignition/
│   └── modules/
│       └── 
├── hardhat.config.ts                  # Hardhat 配置
├── package.json                       # 项目依赖
├── tsconfig.json                      # TypeScript 配置
├── README.md                          # 项目说明
└── images/
    └── 
```   


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