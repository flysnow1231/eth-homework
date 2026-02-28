import { network } from "hardhat";
import { encodeFunctionData, parseAbi } from "viem";
import fs from "fs";

async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  const deployed = JSON.parse(fs.readFileSync("deployed.json", "utf-8"));
  const proxyAddr = deployed.proxy as `0x${string}`;
  const [walletClient1, walletClient2] = await viem.getWalletClients();
  // 关键：合约名写 AkaNft（ABI来自实现合约），地址传 proxyAddr
  const aka = await viem.getContractAt("AkaNft", proxyAddr, {
    client: { wallet: walletClient2, public: publicClient },
  });
  const maxSupply = await aka.read.maxSupply();
  console.log("maxSupply:", maxSupply.toString());
  console.log("address:", aka.address);

  //查看wallet2的balance
  console.log("balance of walletClient2 :", await aka.read.balanceOf([walletClient2.account.address]));
  //购买一个肓盒
  //console.log("\npurseNft :", await aka.write.purseNft());

   //给拍卖地址授权
  //  console.log("box is approved:", await aka.write.setApprovalForAll([proxyAddr,true],{
  //     account: walletClient2.account,   // 👈 指定签名账户
  //  }));
  

  //将肓挂单拍卖
  //console.log("open on sale:", await aka.write.openBoxOnSale([1n]))
  
  //wallet1 出价
  // const result = await aka.write.placeBid([1n,1n,1n],{
  //     account: walletClient1.account,   // 👈 指定签名账户
  //  });
  // console.log("bid result:",result);

  //查看box 1的当时最高拍卖价
  //console.log("price:, bidder=", await aka.read.getBoxPrice([1n]));
  
  //查看box 1的owner
  console.log("owner of box is:", await aka.read.ownerOf([1n]));
 
  //查看box的授权账户
  //console.log("box is approved:", await aka.read.getApproved([1n]));

  //wallet1 
  // console.log("stop auction:", await aka.write.stopAuction([1n],{
  //     account: walletClient2.account,   // 👈 指定签名账户
  //  }));
  
  //  console.log("box is approved:", await aka.write.approve([walletClient1.acco,1n],{
  //     account: walletClient2.account,   // 👈 指定签名账户
  //  }));

   

  //console.log("\n openBoxOnSale:", await akaNft.write.openBoxOnSale([2n]));
  //  console.log("\n purseNft :", await proxy.write.purseNft());
  //  console.log("balance of walletClient2 :", await proxy.read.balanceOf([walletClient2.account.address]));
  //  console.log("balance:", await proxy.read.balanceOf([walletClient2.account.address]));
  //console.log("price:, bidder", await akaNft.write.openBoxOnSale([1n]))
  //console.log("purseNft:",await akaNft.write.purseNft());
  //  const txHash = await akaNft.write.purseNft( {
  //   account: walletClient2.account,
  //  });
  //console.log("tx:", txHash);
  //console.log("price:", await akaNft.read.getBoxPrice([1n]));
  //  console.log("owner of box= ,is ", await akaNft.read.ownerOf([1n])); ;
  //  const result = await akaNft.write.placeBid([2n,1n,1n],{
  //   account: walletClient1.account,   // 👈 指定签名账户
  //  });
  //console.log("result:", result);
  //console.log("price:, bidder", await akaNft.read.getBoxPrice([1n]));
  //console.log("owner of box= ,is ", await proxy.write.stopAuction([1n])); ;
  // const result = await akaNft.write.placeBid([2n,1n,1n],{
  //   account: walletClient1.account,   // 👈 指定签名账户
  //  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

