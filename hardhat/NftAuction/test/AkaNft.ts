import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { log } from "node:console";



async function setup() {
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

    return {
        akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem
    };

}
async function setupAndInit() {
    const { akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem } = await setup();

    await akaNft.write.initialize([mockAddr, 100n], {
        account: walletClient1.account,
    });
    return {
        akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem
    };

}

test("akaNft: initialize() ", async () => {
    const { akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr } = await setup();
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
});

test("akaNft: purseNft() sold out", async () => {
    const { akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem } = await setupAndInit();
    console.log("purseNft test start:");
    const maxSupply1 = await akaNft.read.maxSupply();
    //初始化完成后状态变量断言

    for (let i = 0; i < maxSupply1; i++) {
        await akaNft.write.purseNft({
            account: walletClient2.account
        });
    }

    await viem.assertions.revertWith(
        akaNft.write.purseNft(),
        "Sold out",
    );
    console.log("purseNft test end");

});

test("akaNft: purseNft()", async () => {
    const { akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem } = await setupAndInit();
    console.log("purseNft test start:");
    const maxSupply1 = await akaNft.read.maxSupply();
    //初始化完成后状态变量断言

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

    //test open sale 
    console.log("openBoxOnSale start:");
    await akaNft.write.openBoxOnSale([1n], { account: walletClient2.account });
    const box0 = await akaNft.read.getPurchasedBlindBox([1n]);
    assert.equal(box0[0], true);
    assert.equal(box0[1], false);
    assert(box0[2] > 0n);
    assert.equal(box0[3] , 0n);
    assert.equal(box0[4] , true);
    console.log("openBoxOnSale end");

    console.log("placeBid start:");
    const bidResult = await akaNft.write.placeBid([1n, 1n, 1n], { account: walletClient1.account });
    console.log("bidResult:", bidResult);
    const bidInfo = await akaNft.read.getBoxPrice([1n]);
    console.log("bidInfo:", bidInfo);
    assert(bidInfo[0] > 0n);
    assert.equal(bidInfo[1].toLocaleLowerCase, walletClient1.account.address.toLocaleLowerCase);

    //higher bid price
    console.log("higher bid price start:");
    const bidResult2 = await akaNft.write.placeBid([1n, 1n, 2n], { account: walletClient3.account });
    const bidInfo2 = await akaNft.read.getBoxPrice([1n]);
    console.log("bidInfo:", bidInfo2);
    assert(bidInfo2[0] > 0n);
    assert.equal(bidInfo2[1].toLocaleLowerCase, walletClient3.account.address.toLocaleLowerCase);
    console.log("higher bid price test end");

    //stop auction
    console.log("stop auction start:");
    const wallet3Balance0 = await akaNft.read.balanceOf([walletClient3.account.address]);
    const stopResult = await akaNft.write.stopAuction([1n], { account: walletClient2.account });
    
    console.log("stopResult:", stopResult);
    const wallet3Balance1 = await akaNft.read.balanceOf([walletClient3.account.address]);
   
    assert.equal(wallet3Balance0, 0n);
    assert.equal(wallet3Balance1, 1n);
  
    console.log("stop auction end");

});

test("akaNft: stopAuction() only owner", async () => {
    const { akaNft,
        walletClient1,
        walletClient2,
        walletClient3,
        mockAddr,
        viem } = await setupAndInit();
    console.log("stopAuction test start:");
    const maxSupply1 = await akaNft.read.maxSupply();
    //初始化完成后状态变量断言

    await akaNft.write.purseNft({
        account: walletClient2.account
    });
    

    await viem.assertions.revertWith(
        akaNft.write.stopAuction([0n], { account: walletClient1.account }),   
        "only owner of box can stop auction",
    );
    console.log("stopAuction test end");

});