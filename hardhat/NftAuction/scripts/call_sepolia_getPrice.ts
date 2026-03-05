import { network } from "hardhat";
import { encodeFunctionData, parseAbi } from "viem";
import fs from "fs";

async function main() {
   const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
  
    const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
    const proxyAddr = deployed.proxy as `0x${string}`;
    const [walletClient1, walletClient2] = await viem.getWalletClients();
    // 关键：合约名写 AkaNft（ABI来自实现合约），地址传 proxyAddr
    const usdPriceManager = await viem.getContractAt("UsdPriceManager", proxyAddr, {
      client: { wallet: walletClient2, public: publicClient },
    });
    const ethPrice = await usdPriceManager.write.ethAmountToUsd([1n]);
    console.log("ethPrice", ethPrice);

}

main().catch(console.error);