import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Label, Table, InputGroup } from 'reactstrap';
import axios from 'axios';

const buttonStyle = {
  width: '80px'
};

const labelStyle = {
  display: 'inline-block',
  width: '140px',
  padding: '5px'
};

const inputStyle = {
  // display: 'inline-block',
  // fontFamily:'monospace',
};

const tableDivStyle = {
  padding: '10px',
  margin: '10px auto 10px auto',
  boxShadow: '0px 5px 15px 2px #000',
  width: '70%',
  background: '#fff'
};

const containerStyle = {
  margin: '10px auto 10px auto',
  padding: '10px 5px 15px 5px',
  // boxShadow: "0px 5px 10px 2px #000",
  width: '500px',
  background: '#fff'
};

export default class DisplayVoterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVotersList: false,
      voterTable: null
    };

    this.submit = this.submit.bind(this);
    this.election = this.props.mycon;
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
    // alert(this.election);
    this.electionInstance = await this.election.deployed();
    // alert(this.electionInstance);
  }

  async submit() {
    const const_id = document.getElementById('const_id').value;

    // alert(this.electionInstance);
    const fileHash = await this.electionInstance.voterListHash(const_id);
    const fileURL = 'https://ipfs.infura.io/ipfs/' + fileHash;

    var res = await axios.get(fileURL);
    res = res.data.split('\n');
    const voterListLength = res.length;

    res = res.map(text => text.split(','));

    var voterTable = [];
    var count = 1;
    for (var loop = 0; loop < voterListLength - 1; loop++) {
      voterTable.push(
        <tr key={loop}>
          <td>{count}</td>
          <td>{res[loop][0]}</td>
          <td>{res[loop][1]}</td>
          <td>{res[loop][2]}</td>
        </tr>
      );
      count++;
    }

    this.setState({ voterTable, showVotersList: true });
  }

  render() {
    return (
      <div className='text-center'>
        <div>
          <h1 className='display-4' style={{ fontFamily: 'monospace' }}>
            Voters List Display
          </h1>
        </div>
        <br />

        <div style={containerStyle}>
          <div>
            <InputGroup style={{ paddingBottom: '10px' }}>
              <Label for='const_id' style={labelStyle}>
                Constituency ID -
              </Label>
              <input
                id='const_id'
                placeholder='Enter here'
                style={inputStyle}
                size='7'
                maxLength='4'
              />
              <span className='align-bottom'>&nbsp; &nbsp;</span>
            </InputGroup>
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
        {this.state.showVotersList && (
          <div style={tableDivStyle}>
            <Table bordered>
              <thead>
                <tr className='text-center'>
                  <th>Sl No.</th>
                  <th>Aadhaar Number</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>{this.state.voterTable}</tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}
