import { ethers } from "ethers";
import fs from "fs";
async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  //读取部署地址
  const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  console.log("deployed.EthUsdPrice", deployed.EthUsdPrice);
  const ethUsdPriceAddress = deployed.EthUsdPrice;
  
  //用「实现合约 ABI」+「代理地址」
  const implAbi = [
    "function ethUsd() external view returns (uint256 price, uint8 decimals, uint256 updatedAt)",
  ];
  console.log("chainId:", (await provider.getNetwork()).chainId);

  const proxyAsImpl = new ethers.Contract(
    ethUsdPriceAddress, // 👈 代理地址
    implAbi,      // 👈 实现合约 ABI
    wallet
  );

  const v = await proxyAsImpl.ethUsd();
  console.log("raw v:", v);

}

main().catch(console.error);