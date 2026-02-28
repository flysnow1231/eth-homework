import hre from "hardhat";

async function main() {
  console.log("hardhat version:", hre.versions);
  console.log("solidity config:", JSON.stringify(hre.config.solidity, null, 2));
}
main();