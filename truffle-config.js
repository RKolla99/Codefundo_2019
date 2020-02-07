const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    abs_indianelection_rithvik1_rithvik1: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('/home/rithvik/PESU/Codefundo/Round2/test.env', 'utf-8'), "https://rithvik1.blockchain.azure.com:3200/NbKV6TcPHn6k2UKKYl-qcktN")
    },
    abs_elections_rithvik_rithvik: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('/home/rithvik/PESU/Codefundo/Round2/Codefundo_2019/test.env', 'utf-8'), "https://rithvik.blockchain.azure.com:3200/8xon16QaSJmfc5vJjuI9HzC4")
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.5.0"
    }
  }
};
