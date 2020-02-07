import React from 'react';
import {
  InputGroup,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
// import { Redirect } from "react-router-dom";
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import axios from 'axios';

const labelStyle = {
  display: 'inline-block',
  width: '140px',
  padding: '5px'
};

const inputStyle = {
  // display: 'inline-block',
  // fontFamily:'monospace',
};

const containerStyle = {
  margin: '10px auto 10px auto',
  padding: '10px 5px 15px 5px',
  // boxShadow: "0px 5px 10px 2px #000",
  width: '500px',
  background: '#fff'
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
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });
    // alert(this.state.account);

    this.electionInstance = await this.election.deployed();

    // alert(this.state.account);
  }

  scannerModal(event) {
    var temp;
    if (event.target.id === 'scan_fingerprint') temp = 'fingerprint';
    else if (event.target.id === 'scan_retina') temp = 'retina';

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
    document.getElementById('aadhar1').value = '';
    document.getElementById('aadhar2').value = '';
    document.getElementById('aadhar3').value = '';
  }

  saveScan(event) {
    const scanVal = document.getElementById('scan').value;
    if (this.state.tempScan === 'fingerprint') {
      this.setState({
        fingerprint: scanVal
      });
    } else if (this.state.tempScan === 'retina') {
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
      console.error('Fingerprint not scanned!!');
    }
    if (this.state.retina === undefined) {
      console.error('Retina not scanned!!');
    } else {
      var aadharNumber = document.getElementById('aadhar1').value;
      aadharNumber += document.getElementById('aadhar2').value;
      (aadharNumber += document.getElementById('aadhar3').value), 10;
      aadharNumber = parseInt(aadharNumber, 10);

      const hasVoted = await this.electionInstance.voterEntry(aadharNumber);
      if (!hasVoted) {
        const verify = await axios.post(
          'http://localhost:5000/api/aadhaaruser',
          {
            aadhaarNumber: aadharNumber,
            fingerprint: this.state.fingerprint,
            retinal: this.state.retina
          }
        );
        console.log(verify);

        if (verify.data.validated) {
          const get_const_id = await axios.get(
            `http://localhost:5000/api/aadhaaruser/${aadharNumber}`
          );
          const const_id = get_const_id.data.constituencyId;
          this.setState({
            aadhar: aadharNumber,
            validUser: true //uncomment line while testing
          });
          this.props.aadhar(aadharNumber);
          this.props.constid(const_id);
          console.log(const_id, aadharNumber);
          this.props.pageindex(3);
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
      <div className=''>
        <div className='text-center'>
          <div>
            <h1 className='display-4' style={{ fontFamily: 'monospace' }}>
              Enter your details
            </h1>
          </div>
          <br />

          <div style={containerStyle}>
            <div>
              <InputGroup style={{ paddingBottom: '10px' }}>
                <Label for='aadhar1' style={labelStyle}>
                  Aadhar Number
                </Label>
                <input
                  id='aadhar1'
                  placeholder='XXXX'
                  style={inputStyle}
                  size='4'
                  maxLength='4'
                />
                <span className='align-bottom'>&nbsp; - &nbsp;</span>
                <input
                  id='aadhar2'
                  placeholder='XXXX'
                  style={inputStyle}
                  size='4'
                  maxLength='4'
                />
                <span>&nbsp; - &nbsp;</span>
                <input
                  id='aadhar3'
                  placeholder='XXXX'
                  style={inputStyle}
                  size='4'
                  maxLength='4'
                />
              </InputGroup>
            </div>
            <br />
            <div>
              <InputGroup>
                <Label for='scan_fingerprint' style={labelStyle}>
                  Fingerprint
                </Label>
                <Button
                  id='scan_fingerprint'
                  size='sm'
                  onClick={this.scannerModal}
                >
                  {' '}
                  SCAN{' '}
                </Button>
                {this.state.fingerprint && (
                  <div
                    style={{
                      paddingTop: '5px',
                      width: '30px'
                    }}
                  >
                    <IoIosCheckmarkCircleOutline size='30' />
                  </div>
                )}
              </InputGroup>
            </div>
            <br />
            <div>
              <InputGroup>
                <Label for='scan_retina' style={labelStyle}>
                  Retina
                </Label>
                <Button
                  id='scan_retina'
                  size='sm'
                  onClick={this.scannerModal}
                  style={{ marginRight: '2px' }}
                >
                  {' '}
                  SCAN{' '}
                </Button>
                {this.state.retina && (
                  <div
                    style={{
                      paddingTop: '5px',
                      width: '30px'
                    }}
                  >
                    <IoIosCheckmarkCircleOutline size='30' />
                  </div>
                )}
              </InputGroup>
            </div>
            <div>
              <Modal isOpen={this.state.showScannerModal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Scanning...</ModalHeader>
                <ModalBody>
                  <span>Number </span>
                  <input
                    id='scan'
                    placeholder='XXXX'
                    style={inputStyle}
                    size='4'
                    maxLength='4'
                  />
                </ModalBody>
                <ModalFooter>
                  <div className='text-center' style={{ width: '100%' }}>
                    <Button id='done' size='sm' onClick={this.saveScan}>
                      {' '}
                      DONE{' '}
                    </Button>
                  </div>
                </ModalFooter>
              </Modal>
            </div>
            <br />
            <div className='text-center'>
              <Button
                id='submit'
                onClick={this.submit}
                className='btn-success'
                style={{ fontFamily: 'monospace' }}
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
                    className='btn-retry'
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
                  <Button className='btn-retry' onClick={this.toggleHasVoted}>
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
