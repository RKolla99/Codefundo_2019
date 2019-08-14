var IndianElection = artifacts.require("./IndianElection.sol");

module.exports = function(deployer) {
  deployer.deploy(IndianElection);
};
