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
  constructor() {
    super();
    this.state = {
      showScannerModal: false,
      validUser: false
    };
    this.scannerModal = this.scannerModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.saveScan = this.saveScan.bind(this);
    this.submit = this.submit.bind(this);
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

  submit() {
    if (this.state.fingerprint === undefined) {
      console.error("Fingerprint not scanned!!");
    }
    if (this.state.retina === undefined) {
      console.error("Retina not scanned!!");
    } else {
      var aadharNumber = document.getElementById("aadhar1").value;
      aadharNumber += document.getElementById("aadhar2").value;
      aadharNumber += document.getElementById("aadhar3").value;

      this.setState({
        aadhar: aadharNumber,
        validUser: true //uncomment line while testing
      });

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
        </div>
      </div>
    );
  }
}
