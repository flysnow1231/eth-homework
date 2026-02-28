import { network } from "hardhat";
import { encodeFunctionData, parseAbi } from "viem";
import fs from "fs";

async function main() {
   const { viem } = await network.connect();
   const publicClient = await viem.getPublicClient();
   console.log("Connected");

  // 获取合约实例
  const deployerAddr = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  const akaNft = await viem.getContractAt("AkaNft", deployerAddr.AkaNft);
  
  //读取部署地址
  console.log("deployed.usdPriceManager", deployerAddr.usdPriceManager);
  const usdPriceManager = deployerAddr.usdPriceManager;

   //读取当前值
   //await akaNft.write.initialize([usdPriceManager]);
   console.log("\ninitialize finished.maxSupply:", await akaNft.read.maxSupply());
   const [walletClient] = await viem.getWalletClients();
   const callerAddress = walletClient.account.address;
   console.log("\n caller:", walletClient.account.address);
   console.log("balance:", await akaNft.read.balanceOf([walletClient.account.address]));
   //console.log("\n purseNft :", await akaNft.write.purseNft());
  
  //console.log("\n openBoxOnSale:", await akaNft.write.openBoxOnSale([1n]));
   const result = await akaNft.read.getPurchasedBlindBox([1n]);

  
  // const toBid = await akaNft.simulate.placeBid([1n,1n,2n]);
  console.log("price:, bidder", await akaNft.read.getBoxPrice([1n]));

    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

