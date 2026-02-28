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
  const AkaNftImplContract = await viem.deployContract("AkaNft", []);
  const implAddr = AkaNftImplContract.address;
  console.log("implementation:", implAddr);

  const deployedAddr = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  //读取部署地址
  console.log("deployed.usdPriceManager", deployedAddr.usdPriceManager);

  // 2) 编码 initialize calldata（让代理构造时 delegatecall 初始化）
  // ⚠️ 参数要和你合约的 initialize(...) 一致
  // 例：initialize(address initialOwner, uint256 maxSupply)
  const initData = encodeFunctionData({
    abi: AkaNftImplContract.abi,
    functionName: "initialize",
    args: [deployedAddr.usdPriceManager, 100n],
  });

  // 3) 部署 ERC1967Proxy(impl, initData)
  
  const proxy = await viem.deployContract("ERC1967Proxy", [
    implAddr,
    initData,
  ]);

  console.log("proxy:", proxy.address);

  let deployed: DeployMap = {};
  const file = "./deployed.json";    
  if (fs.existsSync(file)) {
      deployed = JSON.parse(fs.readFileSync(file, "utf8"));
  }
  deployed["proxy"] = proxy.address;
  const outPath = path.join(process.cwd(), "deployed.json");
  fs.writeFileSync(outPath, JSON.stringify(deployed, null, 2));
  
  // 4) 用 AkaNft ABI + proxy 地址来读写（这才是对外地址）
  const akaViaProxy = await viem.getContractAt("AkaNft", proxy.address);

  const maxSupply = await akaViaProxy.read.maxSupply();
  console.log("maxSupply via proxy:", maxSupply.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});