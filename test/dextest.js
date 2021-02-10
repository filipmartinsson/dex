const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");

const LINK_TOKEN = web3.utils.fromUtf8("LINK");
const BUY_SIDE = 0;
const SELL_SIDE = 1;

contract("Dex", accounts => {
    it("should add a SELL limit order", async () => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        link.approve(dex.address, 10000);
        dex.addToken(LINK_TOKEN, link.address);
        dex.deposit(100, LINK_TOKEN);
        dex.createLimitOrder(LINK_TOKEN, 50, 10, SELL_SIDE);
        console.log(await dex.getOrderBook(LINK_TOKEN, SELL_SIDE));
    })

});