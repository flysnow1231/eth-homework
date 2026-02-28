import { network } from "hardhat";
import { encodeFunctionData, parseAbi } from "viem";
import fs from "fs";
import path from "path";

type DeployMap = Record<string, string>;
// OZ 代理合约 artifact（来自 @openzeppelin/contracts）
async function main() {
  // hardhat-viem：拿到 publicClient / walletClients
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  console.log("Connected");

  const [walletClient1, walletClient2] = await viem.getWalletClients();
  const deployerAddr = walletClient1.account.address;
  console.log("deployer:", deployerAddr);

  // 1) 部署 Implementation（AkaNft）
  // 这里假设你的合约名就是 AkaNft，并且是 upgradeable（有 initialize）
  const akaNftImplContract = await viem.deployContract("AkaNft", []);
  const implAddr = akaNftImplContract.address;
  console.log("implementation:", implAddr);

  const deployedAddr = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  //读取部署地址
  console.log("deployed.usdPriceManager", deployedAddr.usdPriceManager);


  await akaNftImplContract.write.initialize([deployedAddr.usdPriceManager,100n]);

  //aka implements写入deploy.json 
  let deployed: DeployMap = {};
   const file = "./deployed.json";    
   if (fs.existsSync(file)) {
       deployed = JSON.parse(fs.readFileSync(file, "utf8"));
   }
   deployed["AkaNft"] = implAddr;
   const outPath = path.join(process.cwd(), "deployed.json");
   fs.writeFileSync(outPath, JSON.stringify(deployed, null, 2));
  
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});