const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
module.exports = {
  networks: {
    electiontesting: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync("/home/rithvik/PESU/Codefundo/Codefundo_2019/test.env", "utf-8"), "https://ishar.blockchain.azure.com:3200/cA6lnejPZ8JHtLkiWX2F0wDV"),
      consortium_id: 1565850672707
    },
    testazure1: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('/home/rithvik/PESU/Codefundo/Codefundo_2019/test.env', 'utf-8'), "https://rithvik.blockchain.azure.com:3200/rqfZ4Zc0oSH7eGsA-pc58Ocm"),
      consortium_id: 1566144132513
    }
  },
  mocha: {},
  compilers: {
    solc: {}
  }
};
