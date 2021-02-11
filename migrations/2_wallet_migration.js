const Wallet = artifacts.require("Wallet");

module.exports = function(deployer) {
  deployer.deploy(Wallet);
};
