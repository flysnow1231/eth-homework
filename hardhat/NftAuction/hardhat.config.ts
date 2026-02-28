import { defineConfig } from "hardhat/config";
import "dotenv/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";

export default defineConfig({
  plugins: [hardhatToolboxViem],
  // solidity: {
  // version: "0.8.24",
  // settings: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 200,
  //    },
  //   },
  // },  
  
  solidity: {
    npmFilesToBuild: [
      "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol",
    ],
    profiles: {
      default: {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: "cancun",
        },
      },
    },
  },
  networks: {
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC!,
      accounts: [
        process.env.PRIVATE_KEY!,
        process.env.PRIVATE_KEY_ACCOUNT2!

      ],
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY!],
    },
    hardhat: { type: "edr-simulated" },
  },
});


// import { defineConfig } from "hardhat/config";
// import "dotenv/config";
// import "@nomicfoundation/hardhat-ethers";
// import "@nomicfoundation/hardhat-viem";
// import "@nomicfoundation/hardhat-toolbox-viem";

// export default defineConfig({
//   solidity: "0.8.24",
//   networks: {
//     sepolia: {
//       type: "http",
//       url: process.env.SEPOLIA_RPC!,
//       accounts: [process.env.PRIVATE_KEY!],
//     },

//     // 如果你也需要连本地 hardhat node（npx hardhat node）
//     localhost: {
//       type: "http",
//       url: "http://127.0.0.1:8545",
//       accounts: [process.env.PRIVATE_KEY!], // 或者不写 accounts，用默认也行，看你的插件/用法
//     },

//     // 如果你想用 Hardhat 3 的内存模拟网络（以前的 hardhat 网络）
//     hardhat: {
//       type: "edr-simulated",
//       // 这里可按需加 chainId、accounts 等
//     },
//   },
// });

