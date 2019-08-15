import React, { Component } from "react";
import Web3 from "web3";
import TruffleContract from "truffle-contract";
import IndianElection from "../../build/contracts/IndianElection.json";
import AdminLogin from "../pages/adminLogin";
import Constitution from "../pages/constitution";
import Home from "../pages/home";
import Thankyou from "../pages/thankyou";
import VoterLogin from "../pages/login";
import Vote from "../pages/vote";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      pageIndex: 5
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
    if (this.state.pageIndex == 0) {
      return <AdminLogin />;
    } else if (this.state.pageIndex == 1) {
      return <Constitution mycon={this.election} />;
    } else if (this.state.pageIndex == 2) {
      return <VoterLogin />;
    } else if (this.state.pageIndex == 3) {
      return <Vote />;
    } else if (this.state.pageIndex == 4) {
      return <Home />;
    } else {
      return <Thankyou />;
    }
  }
}

export default App;
