import React from "react";
import AddCandidate from "../components/addCandidate";
import Web3 from "web3";
import {
  Button,
  Label,
  Alert,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Table
} from "reactstrap";
// import {Link} from 'react-router-dom';

const constitutionStyle = {
  width: "500px",
  margin: "auto",
  marginTop: "20%",
  padding: "10px 10px 10px 10px",
  // border: '1px black solid',
  // boxShadow: "0px 5px 10px 2px #000",
  background: "#fff"
};

const labelStyle = {
  display: "inline-block",
  width: "180px",
  padding: "5px"
};

const alertStyle = {
  width: "80%",
  margin: "10px auto 15px auto"
};

const buttonsStyle = {
  // width: '40%',
  margin: "10px auto 5px auto",
  overflow: "auto"
};

class Constituency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCandidateDetails: false,
      showConstitutionDetails: true,
      addCandidate: false,
      candidates: Object(),
      constitution: Object(),
      submit: false,
      confirmSubmit: false,
      web3: this.props.myweb3,
      account: "0x0"
      // blockNumber: 0
    };
    this.addConstituency = this.addConstituency.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
    this.submit = this.submit.bind(this);
    this.confirmSubmit = this.confirmSubmit.bind(this);
    this.confirmSubmitToggle = this.confirmSubmitToggle.bind(this);
    this.election = this.props.mycon;
    this.goHome = this.goHome.bind(this);
    // this.watchEvents = this.watchEvents.bind(this);
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

  goHome() {
    this.props.changePage(4);
  }

  addConstituency() {
    const const_name = document.getElementById("const_name").value;
    const const_id = parseInt(document.getElementById("const_id").value, 10);

    this.electionInstance
      .addConstituency(const_id, const_name, 0, { from: this.state.account })
      .then(result => {
        const newConstitution = { const_id, const_name };
        this.setState({
          showCandidateDetails: true,
          showConstitutionDetails: false,
          addCandidate: false,
          constitution: newConstitution
        });
      });
  }

  addCandidate() {
    if (this.state.addCandidate) {
      const cand_name = document.getElementById("cand_name").value;
      const cand_id = document.getElementById("cand_id").value;

      const candidate = {
        [cand_id]: cand_name
      };

      this.setState({
        candidates: { ...this.state.candidates, ...candidate }
      });

      document.getElementById("cand_name").value = "";
      document.getElementById("cand_id").value = "";
    }

    this.setState({
      addCandidate: true
    });
  }

  async submit() {
    this.confirmSubmitToggle();
    var size = Object.keys(this.state.candidates).length;
    var i;
    for (i = 0; i < size; i++) {
      await this.electionInstance.addCandidate(
        this.state.constitution.const_id,
        i,
        this.state.candidates[i],
        { from: this.state.account }
      );
    }
    this.setState({
      submit: true
    });
  }

  confirmSubmit() {
    this.setState({
      confirmSubmit: true
    });
  }

  confirmSubmitToggle() {
    this.setState({
      confirmSubmit: false
    });
  }

  render() {
    if (this.state.addCandidate) {
      var candidates_arr = [];
      var count = 1;
      for (var i in this.state.candidates) {
        candidates_arr.push(
          <tr key={i + 1}>
            <td>{count}</td>
            <td className='text-center'>{this.state.candidates[i]}</td>
          </tr>
        );
        count++;
      }
    }

    return (
      <div>
        {this.state.showConstitutionDetails && (
          <div id='constitution_details' style={constitutionStyle}>
            <Label for='const_name' style={labelStyle}>
              Constituency Name
            </Label>
            <input id='const_name' />
            <br />
            <Label for='const_id' style={labelStyle}>
              Constituency ID
            </Label>
            <input id='const_id' />
            <br />
            <div className='text-right'>
              <Button size='sm' onClick={this.addConstituency}>
                NEXT
              </Button>
            </div>
          </div>
        )}
        {!this.state.showConstitutionDetails && (
          <div className='text-center'>
            <Alert color='success' style={alertStyle}>
              Constituency successfully added!
            </Alert>
          </div>
        )}
        <div style={{ overflow: "auto" }}>
          <div className='float-left' style={{ width: "50%" }}>
            {this.state.addCandidate && (
              <div>
                <AddCandidate />
              </div>
            )}
            {this.state.showCandidateDetails && (
              <div className='text-right' style={buttonsStyle}>
                <div className='text-center'>
                  <Button className='primary' onClick={this.addCandidate}>
                    Add Candidate
                  </Button>
                </div>
              </div>
            )}
          </div>
          {this.state.addCandidate &&
            Object.keys(this.state.candidates).length > 0 && (
              <div className='float-right' style={{ width: "50%" }}>
                <div
                  style={{ width: "60%", margin: "auto", background: "#fff" }}
                >
                  <Table hover>
                    <thead>
                      <tr>
                        <td>Sl No.</td>
                        <td className='text-center'>Candidate Name</td>
                      </tr>
                    </thead>
                    <tbody>{candidates_arr}</tbody>
                  </Table>
                </div>
                <div
                  style={{ width: "60%", margin: "auto" }}
                  className='text-center'
                >
                  <Button className='btn-success' onClick={this.confirmSubmit}>
                    Submit
                  </Button>
                </div>
                <div>
                  <Modal
                    isOpen={this.state.confirmSubmit}
                    toggle={this.confirmSubmitToggle}
                  >
                    <ModalHeader toggle={this.confirmSubmitToggle}>
                      Confirm to save candidate details
                    </ModalHeader>
                    <ModalBody>
                      Are you sure you want to add no more candidates?
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className='btn-success'
                        size='sm'
                        onClick={this.submit}
                      >
                        Submit
                      </Button>
                      <Button
                        className='btn-danger'
                        size='sm'
                        onClick={this.confirmSubmitToggle}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </div>
            )}
          {this.state.submit && (
            <div>
              <Modal isOpen={true}>
                <ModalHeader>Details Saved Successfully!</ModalHeader>
                <ModalFooter>
                  <Button
                    className='btn-success'
                    size='sm'
                    onClick={this.goHome}
                  >
                    Return Home
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Constituency;
