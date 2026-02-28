import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

type DeployMap = Record<string, string>;

async function deployWithArtifact(
  wallet: ethers.Wallet,
  contractName: string,
  args: any[],
  nonce: number
) {
  const artifact = await hre.artifacts.readArtifact(contractName);

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  // ✅ 显式指定 nonce（最关键）
  const contract = await factory.deploy(...args, { nonce });

  await contract.waitForDeployment();

  const addr = contract.target as string;
  console.log(`✅ ${contractName} deployed: ${addr} (nonce=${nonce})`);
  return { contract, address: addr };
}

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const deployerAddr = await wallet.getAddress();
  console.log("Deployer:", deployerAddr);

  // ✅ 只取一次 pending nonce，当作起点
  let nonce = await provider.getTransactionCount(deployerAddr, "pending");
  console.log("nonce(pending) start:", nonce);

  let deployed: DeployMap = {};

  const usdPriceManager = await deployWithArtifact(wallet, "UsdPriceManager", ['0x694AA1769357215DE4FAC081bf1f309aDC325306'], nonce++);
 

  const file = "./deployed.json";
  
  if (fs.existsSync(file)) {
    deployed = JSON.parse(fs.readFileSync(file, "utf8"));
  }
   deployed["usdPriceManager"] = usdPriceManager.address;
  const outPath = path.join(process.cwd(), "deployed.json");
  fs.writeFileSync(outPath, JSON.stringify(deployed, null, 2));
  console.log("📝 deployed.json written:", outPath);
  console.log("Deploy map:", deployed);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});