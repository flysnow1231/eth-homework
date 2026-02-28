npx hardhat compile
npx hardhat run scripts/interact.ts --network sepolia

npx hardhat run scripts/deploy_proxy.ts --network sepolia

npx hardhat run scripts/deploy_UsdPriceManager.ts --network sepolia
npx hardhat run scripts/deploy_Aka.ts --network sepolia
npx hardhat run scripts/deploy_upgrade.ts --network sepolia
rm -rf artifacts cache
npx hardhat clean
npx hardhat compile --force


0xbc63e9b8c7563afde3721F7fD1c40112d3b46AbF
0xcaA35614B6b8e1F1F0f4A668686A6242cf6067F5