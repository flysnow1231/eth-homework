import { network } from "hardhat";
import { encodeFunctionData } from "viem";
import fs from "fs";

async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [walletClient1, walletClient2] = await viem.getWalletClients();

  console.log("Connected:", await publicClient.getChainId?.());

  const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));

  // 1) 你第一次部署后必须把 proxy 地址写进 deployed.json
  //    例如 deployed.akaNftProxy = "0x..."
  const proxyAddr: `0x${string}` = deployed.proxy;
  console.log("proxy:", proxyAddr);

  // 2) 部署新的 Implementation（新版本合约名按你的工程来）
  //    - 如果你还是叫 AkaNft，只是代码更新了，也可以继续 deployContract("AkaNft", [])
  //    - 更推荐用新名字 AkaNftV2 / AkaNftV3，避免混淆
  // const newImpl = await viem.deployContract("AkaNft", []);
  // const newImplAddr = newImpl.address;
  // console.log("new implementation:", newImplAddr);

  // 3) 用“实现合约 ABI + proxy 地址”来拿到可写合约实例（关键：地址是 proxy）
  const akaViaProxy = await viem.getContractAt("AkaNft", proxyAddr, {
    client: { wallet: walletClient1 },
  });

  // 4) 如果没有新增初始化逻辑：直接 upgradeToAndCall(newImpl, "0x")
  //    注意：要求 _authorizeUpgrade 允许当前调用者（通常 onlyOwner）
  const txHash = await akaViaProxy.write.upgradeToAndCall([deployed.AkaNft, "0x"]);
  console.log("upgrade tx:", txHash);

  // 5) 验证：读 implementation（可选）/ 读新变量
  const maxSupply = await akaViaProxy.read.maxSupply();
  console.log("maxSupply via proxy:", maxSupply.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});