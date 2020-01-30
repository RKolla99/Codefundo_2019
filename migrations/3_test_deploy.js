var TestingIpfs = artifacts.require("./TestingIpfs.sol");

module.exports = function(deployer) {
  deployer.deploy(TestingIpfs);
};
