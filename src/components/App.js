import React, { Component } from "react";
import Web3 from "web3";
import TruffleContract from "truffle-contract";
import IndianElection from "../../build/contracts/IndianElection.json";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false
    };
    if (typeof web3 != "undefined") {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }

    this.web3 = new Web3(this.web3Provider);
    this.election = TruffleContract(IndianElection);
    this.election.setProvider(this.web3Provider);
  }
  //   componentWillMount() {
  //     this.loadBlockchainData();
  //   }

  //   async loadBlockchainData() {
  //     const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
  //     const accounts = await web3.eth.getAccounts();
  //     alert(accounts[0]);
  //   }
  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account });
      this.election.deployed().then(electionInstance => {
        this.electionInstance = electionInstance;
        // this.watchEvents();
        this.electionInstance.candidatesInformation(1, 0).then(candidate => {
          alert(candidate);
          const candidates = [...this.state.candidates];
          candidates.push({
            id: candidate[0],
            name: candidate[1],
            voteCount: candidate[2]
          });

          this.setState({ candidates: candidates });
          this.setState({ hasVoted: false, loading: false });
        });
      });
    });
  }
  render() {
    return (
      <div>
        <h1>My React App!</h1>
      </div>
    );
  }
}

export default App;
