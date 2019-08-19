import React, { Component } from "react";
import Web3 from "web3";
import TruffleContract from "truffle-contract";
import IndianElection from "../../build/contracts/IndianElection.json";
import AdminLogin from "../pages/adminLogin";
import Constituency from "../pages/constituency";
import Home from "../pages/home";
import Thankyou from "../pages/thankyou";
import VoterLogin from "../pages/login";
import Vote from "../pages/vote";
import Results from "../pages/results";
import AdminOption from "../pages/adminOption";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      pageIndex: 4,
      aadharNumber: 0,
      constId: 0
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
    this.changePage = this.changePage.bind(this);
    this.changeAadhar = this.changeAadhar.bind(this);

    this.changeConstId = this.changeConstId.bind(this);
    this.startTime = Date.now();
    this.duration = 5;
  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account });
    });
  }
  changeAadhar(aadharNumber) {
    this.setState({ aadharNumber });
  }

  changeConstId(constId) {
    this.setState({ constId });
  }

  changePage(newIndex) {
    this.setState({
      pageIndex: newIndex
    });
  }
  render() {
    if (this.state.pageIndex == 0) {
      return (
        <AdminLogin
          mycon={this.election}
          myweb3={this.web3}
          account={this.state.account}
          changePage={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 1) {
      return (
        <Constituency
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 2) {
      return (
        <VoterLogin
          mycon={this.election}
          myweb3={this.web3}
          aadhar={this.changeAadhar}
          constid={this.changeConstId}
          pageindex={this.changePage}
        />
      );
    } else if (this.state.pageIndex == 3) {
      return (
        <Vote
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
          currentAdhaar={this.state.aadharNumber}
          currentConstId={this.state.constId}
        />
      );
    } else if (this.state.pageIndex == 4) {
      return <Home changePage={this.changePage} />;
    } else if (this.state.pageIndex == 5) {
      return <Thankyou mycon={this.election} changePage={this.changePage} />;
    } else if (this.state.pageIndex == 6) {
      return (
        <Results
          mycon={this.election}
          myweb3={this.web3}
          changePage={this.changePage}
          startTime={this.startTime}
          duration={this.duration}
        />
      );
    } else if (this.state.pageIndex == 7) {
      return <AdminOption changePage={this.changePage} />;
    }
  }
}

export default App;
