import React from "react";
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

const buttonStyle = {
  width: "80px"
};

const tableDivStyle = {
  padding: "10px",
  margin: "10px auto 10px auto",
  boxShadow: "0px 5px 15px 2px #000",
  width: "70%",
  background: "#fff"
};

export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: {
        1: "John",
        2: "Jake",
        3: "Jane"
      },
      candArr: [],
      confirmVoteModal: false,
      tempCandidateName: "",
      tempCandidateID: "",
      voteSuccessModal: false,
      web3: this.props.myweb3,
      account: "0x0"
    };

    this.confirmVote = this.confirmVote.bind(this);
    this.toggle = this.toggle.bind(this);
    this.cancelVote = this.cancelVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.completedVoting = this.completedVoting.bind(this);
    this.election = this.props.mycon;
  }
  async componentDidMount() {
    this.state.web3.eth.getCoinbase((err, account) => {
      this.setState({ account });
    });
    this.electionInstance = await this.election.deployed();
    const constituency = await this.electionInstance.constituencyList(
      this.props.currentConstId
    );
    const count = constituency[2];
    const arr = [];
    var i;
    for (i = 0; i < count; i++) {
      const candidate = await this.electionInstance.candidatesInformation(
        this.props.currentConstId,
        i
      );
      arr.push(candidate);
    }
    this.setState({ candArr: arr });
    // alert(arr);
  }
  confirmVote(event) {
    const cand_name = event.target.value;
    const cand_id = event.target.id;
    // alert(cand_id);
    this.setState({
      confirmVoteModal: true,
      tempCandidateName: cand_name,
      tempCandidateID: cand_id
    });
  }

  toggle() {
    this.setState(prevState => ({
      confirmVoteModal: !prevState.confirmVoteModal
    }));
  }

  async submitVote() {
    await this.electionInstance.vote(
      this.state.tempCandidateID,
      this.props.currentAdhaar,
      this.props.currentConstId,
      {
        from: this.state.account
      }
    );
    this.setState({
      votedCandidateName: this.state.tempCandidateName,
      votedCandidateID: this.state.tempCandidateID,
      voteSuccessModal: true
    });
    this.toggle();
  }

  cancelVote() {
    this.setState({
      tempCandidateName: "",
      tempCandidateID: ""
    });
    this.toggle();
  }
  completedVoting() {
    this.props.changePage(5);
  }

  render() {
    var candidates_arr = [];
    var count = 1;
    var candidateArrLength = this.state.candArr.length;
    for (var loop = 0; loop < candidateArrLength; loop++) {
      candidates_arr.push(
        <tr key={loop + 1}>
          <td>{count}</td>
          <td>{this.state.candArr[loop][1]}</td>
          <td>{loop}</td>
          <td className="text-center">
            <Button
              id={loop}
              value={this.state.candArr[loop][1]}
              style={buttonStyle}
              size="sm"
              className="btn-success"
              onClick={this.confirmVote}
            >
              VOTE
            </Button>
          </td>
        </tr>
      );
      count++;
    }

    return (
      <div>
        <div style={{ marginTop: "15px" }}>
          <h2 className="text-center">Please cast your vote</h2>
        </div>
        <br />
        <div style={tableDivStyle}>
          <Table bordered>
            <thead>
              <tr className="text-center">
                <th>Sl No.</th>
                <th>Name</th>
                <th>ID</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>{candidates_arr}</tbody>
          </Table>
          <div>
            <Modal isOpen={this.state.confirmVoteModal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>
                {" "}
                Confirm your vote!{" "}
              </ModalHeader>

              <ModalBody>
                Are you sure you want to cast your vote to{" "}
                <b>{this.state.tempCandidateName}</b> ?
              </ModalBody>

              <ModalFooter>
                <Button className="btn-success" onClick={this.submitVote}>
                  Confirm Vote
                </Button>
                <Button onClick={this.cancelVote} className="btn-danger">
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
        <Modal isOpen={this.state.voteSuccessModal}>
          <ModalHeader>
            Your vote has been successfully casted to{" "}
            <b>{this.state.votedCandidateName}</b>
          </ModalHeader>
          <ModalFooter>
            <Button className="btn-success" onClick={this.completedVoting}>
              Okay
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
