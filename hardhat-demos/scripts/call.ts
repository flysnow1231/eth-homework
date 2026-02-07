
import { ethers } from "ethers";
  import fs from "fs";

import path from "path";

console.log("call.ts started");

async function main() {


  const address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  console.log("address:...", address);
  const rpc = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpc);

  console.log("checking network...");
  const net = await provider.getNetwork();
  console.log("network:", net.toString?.() ?? net);

  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("caller:", await wallet.getAddress());


  const abi = [
    "function getVer() public pure returns(string memory)",
  ];

  const c = new ethers.Contract(address, abi, wallet);

  console.log("before =>", (await c.getVer()).toString());

  console.log("sending inc() tx...");
  const tx1 = await c.getVer();
  console.log("tx1 hash:", tx1.hash);
  
  console.log("after inc =>", (await c.getVer()).toString());

}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exitCode = 1;
});
