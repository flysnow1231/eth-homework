import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { log } from "node:console";
import { expect } from "chai";


async function setup() {

  const { viem } = await network.connect();

  const akaNft = await viem.deployContract("AkaNft", []);

  const [wallet1, wallet2] = await viem.getWalletClients();

  return {
    akaNft,
    wallet1,
    wallet2
  };
}

test("akaNft: initialize() ", async () => {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [walletClient1, walletClient2, walletClient3] = await viem.getWalletClients();

    const connection = await network.connect();
    console.log("network:", connection.networkName);

    const DECIMALS = 8;
    const INITIAL_PRICE = 2000n * 10n ** 8n;

    const mock = await viem.deployContract("MockPriceManager", [
      INITIAL_PRICE,
      DECIMALS,
    ]);
    const mockAddr = mock.address;

    const akaNft = await viem.deployContract("AkaNft", []);
    
    // 读初始值
    const maxSupply0 = await akaNft.read.maxSupply();
    const symbol0 = await akaNft.read.symbol();
    const name0 = await akaNft.read.name();

    //初始化前状态变量断言
    assert.equal(maxSupply0, 0n);
    assert.equal(symbol0, "");
    assert.equal(name0, "");

    await akaNft.write.initialize([mockAddr, 100n], {
        account: walletClient1.account,
    });
    const maxSupply1 = await akaNft.read.maxSupply();
    const symbol1 = await akaNft.read.symbol();
    const name1 = await akaNft.read.name();
    const contractOwner0 = await akaNft.read.owner();
    //初始化完成后状态变量断言
    assert.equal(maxSupply1, 100n);
    assert.equal(symbol1, "BB");
    assert.equal(name1, "BlindBox");
    assert.equal(contractOwner0.toString, walletClient1.account.address.toString);

    const wallet2Balance0 = await akaNft.read.balanceOf([walletClient2.account.address]);
    await akaNft.write.purseNft({
        account: walletClient2.account
    });
    await akaNft.write.purseNft({
        account: walletClient2.account
    });
    const wallet2Balance1 = await akaNft.read.balanceOf([walletClient2.account.address]);
    assert.equal(wallet2Balance0, 0n);
    assert.equal(wallet2Balance1, 2n);
  
    assert.equal(symbol1, "BB");
    assert.equal(name1, "BlindBox");
   
    await akaNft.write.openBoxOnSale([1n],{account: walletClient2.account});
    const box0 = await akaNft.read.getPurchasedBlindBox([1n]);
    assert.equal(box0[0], true);
    assert.equal(box0[1], false);
    assert(box0[2] > 0n);

    const bidResult = await akaNft.write.placeBid([1n,1n,1n],{account: walletClient1.account});
    console.log("bidResult:", bidResult);
    const bidInfo= await akaNft.read.getBoxPrice([1n]);
    console.log("bidInfo:", bidInfo);
    //assert(bidInfo > 0n);
});

test("akaNft: purseNft() ", async () => {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [walletClient1, walletClient2, walletClient3] = await viem.getWalletClients();

    const connection = await network.connect();
    console.log("network:", connection.networkName);

    const DECIMALS = 8;
    const INITIAL_PRICE = 2000n * 10n ** 8n;

    const mock = await viem.deployContract("MockPriceManager", [
      INITIAL_PRICE,
      DECIMALS,
    ]);
    const mockAddr = mock.address;

    const akaNft = await viem.deployContract("AkaNft", []);

    await akaNft.write.initialize([mockAddr, 2n], {
        account: walletClient1.account,
    });

    const maxSupply1 = await akaNft.read.maxSupply();
    //初始化完成后状态变量断言
    assert.equal(maxSupply1, 2n);
  

    const wallet2Balance0 = await akaNft.read.balanceOf([walletClient2.account.address]);
    await akaNft.write.purseNft({
        account: walletClient2.account
    });
    await akaNft.write.purseNft({
        account: walletClient2.account
    });

    await viem.assertions.revertWith(
        akaNft.write.purseNft(),
        "Sold out",
    );
   
});