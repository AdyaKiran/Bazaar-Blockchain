const BazaarContract = artifacts.require("BazaarContract");

module.exports = function(deployer) {
  deployer.deploy(BazaarContract);
};