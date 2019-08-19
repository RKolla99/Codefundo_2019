import React from "react";
import {
  InputGroup,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
// import { Redirect } from "react-router-dom";

const labelStyle = {
  display: "inline-block",
  width: "140px",
  padding: "5px"
};

const inputStyle = {
  // display: 'inline-block',
  // fontFamily:'monospace',
};

const containerStyle = {
  margin: "10px auto 10px auto",
  padding: "10px 5px 15px 5px",
  boxShadow: "0px 5px 10px 2px #000",
  width: "500px"
};

export default class VoterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showScannerModal: false,
      validUser: false,
      web3: this.props.myweb3,
      userNotMatch: false,
      hasVoted: false
    };
    this.scannerModal = this.scannerModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleUserNotMatch = this.toggleUserNotMatch.bind(this);
    this.saveScan = this.saveScan.bind(this);
    this.submit = this.submit.bind(this);
    this.election = this.props.mycon;
    this.toggleHasVoted = this.toggleHasVoted.bind(this);
  }

  componentDidMount() {
    this.state.web3.eth.getCoinbase((err, account) => {
      this.setState({ account });
      this.election.deployed().then(electionInstance => {
        this.electionInstance = electionInstance;
      });
    });
  }

  scannerModal(event) {
    var temp;
    if (event.target.id === "scan_fingerprint") temp = "fingerprint";
    else if (event.target.id === "scan_retina") temp = "retina";

    this.setState({
      showScannerModal: true,
      tempScan: temp
    });
  }

  toggle() {
    this.setState(prevState => ({
      showScannerModal: !prevState.showScannerModal
    }));
  }

  toggleUserNotMatch() {
    this.setState({
      userNotMatch: false
    });
    document.getElementById("aadhar1").value = "";
    document.getElementById("aadhar2").value = "";
    document.getElementById("aadhar3").value = "";
    document.getElementById("const_id").value = "";
  }

  saveScan(event) {
    const scanVal = document.getElementById("scan").value;
    if (this.state.tempScan === "fingerprint") {
      this.setState({
        fingerprint: scanVal
      });
    } else if (this.state.tempScan === "retina") {
      this.setState({
        retina: scanVal
      });
    }
    this.setState({
      showScannerModal: false
    });
  }
  toggleHasVoted() {
    this.setState({ hasVoted: false });
    this.props.pageindex(4);
  }

  async submit() {
    if (this.state.fingerprint === undefined) {
      console.error("Fingerprint not scanned!!");
    }
    if (this.state.retina === undefined) {
      console.error("Retina not scanned!!");
    } else {
      var aadharNumber = document.getElementById("aadhar1").value;
      aadharNumber += document.getElementById("aadhar2").value;
      (aadharNumber += document.getElementById("aadhar3").value), 10;
      aadharNumber = parseInt(aadharNumber, 10);

      const const_id = parseInt(document.getElementById("const_id").value, 10);
      const hasVoted = await this.electionInstance.voterEntry(aadharNumber);
      if (!hasVoted) {
        const verify = await this.electionInstance.verifyVoter(
          aadharNumber,
          parseInt(this.state.fingerprint, 10),
          parseInt(this.state.retina, 10),
          const_id
        );
        if (verify) {
          await this.electionInstance.setVerifiedVoter(
            aadharNumber,
            parseInt(this.state.fingerprint, 10),
            parseInt(this.state.retina, 10),
            const_id,
            {
              from: this.state.account
            }
          );
          this.setState({
            aadhar: aadharNumber,
            validUser: true //uncomment line while testing
          });
          this.props.aadhar(aadharNumber);
          this.props.pageindex(3);
          this.props.constid(const_id);
        } else {
          this.setState({
            userNotMatch: true
          });
        }
      } else {
        this.setState({ hasVoted: true });
        // alert("Already voted");
      }
      //Verify user and set this.state.validUser to "true" to redirect to voting page..
    }
  }

  render() {
    if (this.state.validUser) {
      // return <Redirect to="/vote" />;
    }

    return (
      <div className="">
        <div className="text-center">
          <div>
            <h1 className="display-4" style={{ fontFamily: "monospace" }}>
              Enter your details
            </h1>
          </div>
          <br />

          <div style={containerStyle}>
            <div>
              <InputGroup style={{ paddingBottom: "10px" }}>
                <Label for="aadhar1" style={labelStyle}>
                  Aadhar Number
                </Label>
                <input
                  id="aadhar1"
                  placeholder="XXXX"
                  style={inputStyle}
                  size="4"
                  maxLength="4"
                />
                <span className="align-bottom">&nbsp; - &nbsp;</span>
                <input
                  id="aadhar2"
                  placeholder="XXXX"
                  style={inputStyle}
                  size="4"
                  maxLength="4"
                />
                <span>&nbsp; - &nbsp;</span>
                <input
                  id="aadhar3"
                  placeholder="XXXX"
                  style={inputStyle}
                  size="4"
                  maxLength="4"
                />
              </InputGroup>
            </div>
            <br />
            <div>
              <InputGroup>
                <Label for="const_id" style={labelStyle}>
                  Constituency ID
                </Label>
                <input
                  id="const_id"
                  placeholder="XXXX"
                  style={inputStyle}
                  size="4"
                  maxLength="4"
                />
              </InputGroup>
            </div>
            <br />
            <div>
              <InputGroup>
                <Label for="scan_fingerprint" style={labelStyle}>
                  Fingerprint
                </Label>
                <Button
                  id="scan_fingerprint"
                  size="sm"
                  onClick={this.scannerModal}
                >
                  {" "}
                  SCAN{" "}
                </Button>
              </InputGroup>
            </div>
            <br />
            <div>
              <InputGroup>
                <Label for="scan_retina" style={labelStyle}>
                  Retina
                </Label>
                <Button id="scan_retina" size="sm" onClick={this.scannerModal}>
                  {" "}
                  SCAN{" "}
                </Button>
              </InputGroup>
            </div>
            <div>
              <Modal isOpen={this.state.showScannerModal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Scanning...</ModalHeader>
                <ModalBody>
                  <span>Number </span>
                  <input
                    id="scan"
                    placeholder="XXXX"
                    style={inputStyle}
                    size="4"
                    maxLength="4"
                  />
                </ModalBody>
                <ModalFooter>
                  <div className="text-center" style={{ width: "100%" }}>
                    <Button id="done" size="sm" onClick={this.saveScan}>
                      {" "}
                      DONE{" "}
                    </Button>
                  </div>
                </ModalFooter>
              </Modal>
            </div>
            <br />
            <div className="text-center">
              <Button
                id="submit"
                onClick={this.submit}
                className="btn-success"
                style={{ fontFamily: "monospace" }}
              >
                SUBMIT
              </Button>
            </div>
          </div>
          {this.state.userNotMatch && (
            <div>
              <Modal isOpen={this.state.userNotMatch}>
                <ModalHeader> Details does not match!! </ModalHeader>
                <ModalFooter>
                  <Button
                    className="btn-retry"
                    onClick={this.toggleUserNotMatch}
                  >
                    Retry
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          )}
          {this.state.hasVoted && (
            <div>
              <Modal isOpen={this.state.hasVoted}>
                <ModalHeader> You've already voted!! </ModalHeader>
                <ModalFooter>
                  <Button className="btn-retry" onClick={this.toggleHasVoted}>
                    Return home
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
