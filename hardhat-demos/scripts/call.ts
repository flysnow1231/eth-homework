
import { ethers } from "ethers";
  import fs from "fs";

import path from "path";

console.log("call.ts started");

async function main() {


  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
    "function incBy(uint by) public",
    "function getX() public view returns(uint)",
    "function inc() public",   
  ];

  const c = new ethers.Contract(address, abi, wallet);
 // console.log("version =>", (await c.getVer()).toString());

  console.log("before =>", (await c.getX()).toString());
  await c.inc()
  console.log("after inc =>", (await c.getX()).toString());

}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exitCode = 1;
});
