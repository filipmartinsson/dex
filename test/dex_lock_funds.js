const Dex = artifacts.require("Dex")
const Link = artifacts.require("Link")
const truffleAssert = require('truffle-assertions');

contract("Dex", accounts => {
    before("Add tokens to dex", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
        )
    })

    //The user must have ETH deposited such that deposited eth >= buy order value
    it("Funds allocated to limit orders should not be withdrawable by users", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()

        await dex.depositEth({value: 10})
        await truffleAssert.passes(
            dex.createLimitOrder(0, web3.utils.fromUtf8("LINK"), 10, 1)
        )
        await truffleAssert.reverts(
            dex.withdrawEth(10), null, "Expected to fail, because funds have been used on limit order."
        )

        await link.approve(dex.address, 10);
        await dex.deposit(10, web3.utils.fromUtf8("LINK"));
        await truffleAssert.passes(
            dex.createLimitOrder(1, web3.utils.fromUtf8("LINK"), 10, 1)
        )
        await truffleAssert.reverts(
            dex.withdraw(10, web3.utils.fromUtf8("LINK")), null, "Expected to fail, because funds have been used on limit order."
        )

        // Create market orders to empty the orderbook ... otherwise this might affect other tests :(
        await dex.depositEth({value: 10})
        await link.approve(dex.address, 10);
        await dex.deposit(10, web3.utils.fromUtf8("LINK"));
        await dex.createMarketOrder(0, web3.utils.fromUtf8("LINK"), 10);
        await dex.createMarketOrder(1, web3.utils.fromUtf8("LINK"), 10);
    })


})