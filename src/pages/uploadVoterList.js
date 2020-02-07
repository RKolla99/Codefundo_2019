import React from 'react';
// import {Link} from 'react-router-dom';
import Web3 from 'web3';
import { Button, Label } from 'reactstrap';
import axios from 'axios';

const centerStyle = {
  margin: 'auto',
  paddingTop: '20px',
  overflow: 'auto',
  width: '500px',
  // boxShadow: "0px 5px 10px 2px #000"
  background: '#fff'
};

const labelStyle = {
  display: 'inline-block',
  width: '140px',
  padding: '5px'
};

const buttonsStyle = {
  // width: '40%',
  margin: '10px auto 5px auto',
  overflow: 'auto'
};

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

export default class UploadVoterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.voterLogin = this.voterLogin.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.election = this.props.mycon;
  }
  voterLogin() {
    this.props.changePage(2);
  }
  adminLogin() {
    this.props.changePage(0);
  }

  captureFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.props.setBuffer(Buffer(reader.result));
      //   this.setState({ buffer: Buffer(reader.result) });
      console.log('buffer', this.props.getBuffer());
    };
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
    // alert(this.state.account);

    this.electionInstance = await this.election.deployed();
  }
  onSubmit(event) {
    const const_id = document.getElementById('const_id').value;
    console.log(this.props.ipfs);
    console.log(ipfs);
    console.log(this.props.getBuffer());
    event.preventDefault();
    console.log('Submitting file to ipfs...');
    ipfs.add(this.props.getBuffer(), async (error, result) => {
      console.log('Ipfs result', result);
      if (error) {
        console.error(error);
        return;
      }
      console.log(result[0].hash);
      await this.electionInstance.setVoterListFileHash(
        const_id,
        result[0].hash,
        {
          from: this.state.account
        }
      );
    });
  }

  render() {
    return (
      <div style={{ paddingTop: '20%' }}>
        <div style={centerStyle} className=''>
          <div className='text-center'>
            <h1 className='display-4' style={{ fontFamily: 'sans-serif' }}>
              Indian Elections
            </h1>
          </div>
          <br />
          <div className='text-center'>
            <div style={buttonsStyle}>
              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} /> <br /> <br />
                <Label style={labelStyle}>Constituency ID -</Label>
                <input type='text' id='const_id' /> <br />
                <input type='submit' className='primary' style={buttonsStyle} />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
