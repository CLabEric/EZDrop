const EZDrop = artifacts.require("EZDrop");
const PiggyTest = artifacts.require('PiggyTest');

module.exports = function (deployer) {
  // deployer.deploy(EZDrop);
  deployer.deploy(PiggyTest);
};
