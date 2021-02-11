const Link = artifacts.require("Link");
const Wallet = artifacts.require("Wallet");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Link);
  let wallet = await Wallet.deployed()
  let link = await Link.deployed()
  await link.approve(wallet.address, 500)
  wallet.addToken(web3.utils.fromUtf8("LINK"), link.address)
  await wallet.deposit(100, web3.utils.fromUtf8("LINK"))
  let balanceOfLink = await wallet.balances(accounts[0], web3.utils.fromUtf8("LINK"));
  console.log(balanceOfLink);
};