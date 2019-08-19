import React from "react";
import { Button } from "reactstrap";
import Countdown, { zeroPad } from "react-countdown-now";

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
      winnerName: ""
    };
    this.timerMounted = this.timerMounted.bind(this);
    this.timerCompleted = this.timerCompleted.bind(this);
    this.checkResults = this.checkResults.bind(this);
    this.showWinner = this.showWinner.bind(this);
    this.getWinnerName = this.getWinnerName.bind(this);
    this.election = this.props.mycon;
  }
  componentDidMount() {
    this.state.web3.eth.getCoinbase((err, account) => {
      this.setState({ account });
      this.election.deployed().then(electionInstance => {
        this.electionInstance = electionInstance;
      });
    });
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

  async showWinner() {
    const constituencyId = parseInt(
      document.getElementById("constituencyId").value,
      10
    );

    const name = await this.electionInstance.returnWinner(constituencyId);
    this.setState({
      constituencyId: constituencyId,
      showWinner: true,
      winnerName: name
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

  render() {
    return (
      <div>
        <div className="text-center">
          <h2 className="display-4">Results to be declared in</h2>
          <h1 className="display-1">
            <Countdown
              key="resultsTimer"
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
            className="text-center"
            style={{ padding: "10px", margin: "5px" }}
          >
            <Button
              disabled={this.state.resultsButtonDisabled}
              className="btn-warning"
              onClick={this.checkResults}
            >
              Check Results
            </Button>

            <Button className="btn-primary" style={{ margin: "5px" }}>
              Home Page
            </Button>
          </div>
        )}
        {!this.state.checkResults && (
          <div className="text-center" style={{ padding: "10px" }}>
            <label style={{ paddingRight: "5px" }}>Constituency ID</label>
            <input maxLength="4" size="4" id="constituencyId" />
            <div style={{ paddingTop: "10px" }}>
              <Button size="sm" onClick={this.showWinner}>
                CHECK
              </Button>
            </div>
          </div>
        )}
        {this.state.showWinner && (
          <div className="text-center">
            <h2 className="display-4">
              The winner is <b>{this.state.winnerName}</b>
            </h2>
          </div>
        )}
      </div>
    );
  }
}
