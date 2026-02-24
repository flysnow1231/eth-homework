import { ethers } from "ethers";
import fs from "fs";
async function main() {
  // 1️⃣ 连接本地链
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // 2️⃣ 调用者钱包
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  // 3️⃣ 读取部署地址
  const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  console.log("deployed.Proxy", deployed.Proxy);

  const proxyAddress = deployed.Proxy;
  
  // 4️⃣ ⚠️ 用「实现合约 ABI」+「代理地址」
  const implAbi = [
    "function foo() public",
    "function upgrade(address newImplementation) external",
    "function getWord() public view returns(string memory)",
  ];

  const proxyAsImpl = new ethers.Contract(
    proxyAddress, // 👈 代理地址
    implAbi,      // 👈 实现合约 ABI
    wallet
  );

  // // 5️⃣ 写操作 → 走 fallback → delegatecall
  // const tx = await proxyAsImpl.foo();
  // await tx.wait();
  // console.log("✅ setValue via proxy done");

  // 6️⃣ 读操作 → 仍然走 fallback
  // await proxyAsImpl.foo();
  // const v = await proxyAsImpl.getWord();
  // console.log("raw v:", v);

    // 1) upgrade 发交易 -> 等上链
    // const tx1 = await proxyAsImpl.upgrade("0x0B306BF915C4d645ff596e518fAf3F9669b97016");
    // const r1 = await tx1.wait();
    // console.log("upgrade mined block:", r1.blockNumber);

    // // 2) foo 发交易 -> 等上链
    //  const tx2 = await proxyAsImpl.foo();
    //  const r2 = await tx2.wait();
    //  console.log("foo mined block:", r2.blockNumber);

    const x = await proxyAsImpl.getWord();
    console.log("raw x:", x);

  // console.log("value:", Array.isArray(v) ? v[0].toString() : v.toString());
  // const code = await provider.getCode(proxyAddress);
  // console.log("code length:", code.length); // 不是 "0x" 才对 
 
 
}

main().catch(console.error);