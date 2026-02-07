import { ethers } from "ethers";

console.log("call.mjs started");

async function main() {
  const rpc = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpc);

  console.log("checking network...");
  const net = await provider.getNetwork();
  console.log("network:", net);

  // 用 Hardhat node 启动时打印的第一个 private key（你要替换成你自己的）
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("caller:", await wallet.getAddress());

  const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  // 先用最简单的 abi（你按你的函数改）
  const abi = [
    "incBy(uint by)",
    "inc()"
  ];

  const c = new ethers.Contract(address, abi, wallet);

  console.log("calling get()...");
  const v = await c.inc();
  console.log("get() =>", v.toString());

//   console.log("sending set(123) tx...");
//   const tx = await c.set(123);
//   console.log("tx hash:", tx.hash);

//   console.log("waiting confirm...");
//   const receipt = await tx.wait();
//   console.log("mined in block:", receipt.blockNumber);
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exitCode = 1;
});
