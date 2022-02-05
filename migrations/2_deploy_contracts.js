const EZDrop = artifacts.require("EZDrop");
const PigsTest = artifacts.require('PigsTest');

module.exports = function (deployer) {
  // deployer.deploy(EZDrop);
  deployer.deploy(PigsTest);
};
