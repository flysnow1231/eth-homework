import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";

async function main() {
  // 1. 连接本地 hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // 2. 使用 hardhat node 给的第一个账号
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  // 3. 读取编译后的合约 artifact
  const artifact = await hre.artifacts.readArtifact("Counter");

  // 4. 构造合约工厂并部署
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("✅ Counter deployed to:", contract.target);

  // 5. 把真实地址写入文件（非常关键）
  fs.writeFileSync(
    "deployed.json",
    JSON.stringify({ Counter: contract.target }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
