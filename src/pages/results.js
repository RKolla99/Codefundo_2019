import React from "react";
import axios from "axios";
import {
  InputGroup,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";
import Countdown, { zeroPad } from "react-countdown-now";
const labelStyle = {
  display: "inline-block",
  width: "140px",
  padding: "5px"
};
const tableDivStyle = {
  padding: "10px",
  margin: "10px auto 10px auto",
  boxShadow: "0px 5px 15px 2px #000",
  width: "70%",
  background: "#fff"
};

const inputStyle = {
  display: "inline-block"
  // fontFamily:'monospace',
};

const containerStyle = {
  margin: "10px auto 10px auto",
  padding: "10px 5px 15px 5px",
  // boxShadow: "0px 5px 10px 2px #000",
  width: "500px",
  background: "#fff"
};
export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerRef: "",
      startTime: this.props.startTime,
      duration: this.props.duration * 60 * 1000,
      resultsButtonDisabled: true,
      timerComplete: false,
      checkResults: true,
      showWinner: false,
      web3: this.props.myweb3,
      account: "0x0",
      winnerName: "",
      constituencyId: null,
      constInfo: null,
      candidateInfo: null,
      gotVoteCount: false,
      resTable: null
    };
    this.timerMounted = this.timerMounted.bind(this);
    this.timerCompleted = this.timerCompleted.bind(this);
    this.checkResults = this.checkResults.bind(this);
    this.showWinner = this.showWinner.bind(this);
    this.getWinnerName = this.getWinnerName.bind(this);
    this.election = this.props.mycon;
    this.goHome = this.goHome.bind(this);
    this.getConstituencyInfo = this.getConstituencyInfo.bind(this);
    this.getVoteInfo = this.getVoteInfo.bind(this);
  }
  async componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      this.election.setProvider(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      this.election.setProvider(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });
    // alert(this.state.account);

    this.electionInstance = await this.election.deployed();
  }
  timerCompleted() {
    this.setState({
      timerComplete: true,
      resultsButtonDisabled: false
    });
  }

  checkResults() {
    this.setState({
      checkResults: false
    });
  }

  async getConstituencyInfo() {
    // Get file hash
    const fileHash = await this.electionInstance.constituencyFileHash(
      this.state.constituencyId
    );
    // alert(fileHash);

    const fileURL = "https://ipfs.infura.io/ipfs/" + fileHash;
    var res = await axios.get(fileURL);
    res = res.data.split("\n");
    console.log(res);
    var constInfo = res[1];
    res.splice(0, 2);
    for (var i = 0; i < res.length; i++) {
      res[i] = res[i].split(",");
    }
    var candidateInfo = res;
    // console.log(constInfo);
    // console.log(candidateInfo);
    this.setState({ constInfo });
    this.setState({ candidateInfo });
  }

  async getVoteInfo() {
    var candidateInfo = this.state.candidateInfo;
    var candidateId;
    var votecount;
    for (var i = 1; i < candidateInfo.length; i++) {
      candidateId = parseInt(candidateInfo[i][0], 10);
      votecount = await this.electionInstance.returnVoteCount(candidateId);
      candidateInfo[i].push(parseInt(votecount, 10));
    }
    console.log(candidateInfo);
    var resTable = [];
    var count = 1;
    var candidateArrLength = this.state.candidateInfo.length;
    for (var loop = 1; loop < candidateArrLength; loop++) {
      resTable.push(
        <tr key={loop}>
          <td>{count}</td>
          <td>{this.state.candidateInfo[loop][1]}</td>
          <td>{this.state.candidateInfo[loop][0]}</td>
          <td className='text-center'>{candidateInfo[loop][3]}</td>
        </tr>
      );
      count++;
    }

    await this.setState({
      candidateInfo: candidateInfo,
      gotVoteCount: true,
      resTable: resTable
    });
  }

  async showWinner() {
    const constituencyId = parseInt(
      document.getElementById("constituencyId").value,
      10
    );
    await this.setState({ constituencyId: constituencyId });

    // Get the candidate info for the particular constituency
    await this.getConstituencyInfo();
    // Get the vote counts
    await this.getVoteInfo();
    // Get the winner
    var maxVotes = 0;
    var winnerName;
    for (var i = 1; i < this.state.candidateInfo.length; i++) {
      if (this.state.candidateInfo[i][3] > maxVotes) {
        winnerName = this.state.candidateInfo[i][1];
      }
    }

    this.setState({
      constituencyId: constituencyId,
      showWinner: true,
      winnerName: winnerName
    });
  }

  //get winner name using id
  getWinnerName(id) {
    return "Reddy";
  }

  timerMounted(timer) {
    if (timer.completed) {
      this.timerCompleted();
    }
  }

  goHome() {
    this.props.changePage(4);
  }

  render() {
    return (
      <div>
        <div className='text-center'>
          <h2 className='display-4'>Results to be declared in</h2>
          <h1 className='display-1'>
            <Countdown
              key='resultsTimer'
              onMount={this.timerMounted}
              date={this.state.startTime + this.state.duration}
              onComplete={this.timerCompleted}
              renderer={timer => (
                <div>
                  {zeroPad(timer.hours)}:{zeroPad(timer.minutes)}:
                  {zeroPad(timer.seconds)}
                </div>
              )}
            />
          </h1>
        </div>
        {this.state.checkResults && (
          <div
            className='text-center'
            style={{ padding: "10px", margin: "5px" }}
          >
            <br />
            <br />
            <span>&nbsp;&nbsp;&nbsp;</span>
            <Button
              disabled={this.state.resultsButtonDisabled}
              className='btn-warning'
              onClick={this.checkResults}
            >
              Check Results
            </Button>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <Button
              className='btn-primary'
              style={{ margin: "5px" }}
              onClick={this.goHome}
            >
              Home Page
            </Button>
          </div>
        )}
        {!this.state.checkResults && (
          <div className='text-center' style={{ padding: "10px" }}>
            <label style={{ paddingRight: "5px" }}>Constituency ID</label>
            <input maxLength='4' size='4' id='constituencyId' />
            <div style={{ paddingTop: "10px" }}>
              <Button size='sm' onClick={this.showWinner}>
                CHECK
              </Button>
            </div>
          </div>
        )}
        {this.state.gotVoteCount && (
          <div style={tableDivStyle}>
            <Table bordered>
              <thead>
                <tr className='text-center'>
                  <th>Sl No.</th>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Vote count</th>
                </tr>
              </thead>
              <tbody>{this.state.resTable}</tbody>
            </Table>
          </div>
        )}
        {this.state.showWinner && (
          <div className='text-center'>
            <h2 className='display-4'>
              The winner is <b>{this.state.winnerName}</b>
            </h2>
          </div>
        )}
      </div>
    );
  }
}
