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
//import { Redirect } from 'react-router-dom';

const style = {
  margin: "auto auto auto auto",
  padding: "10px 5px 15px 5px"

  // boxShadow: '0px 5px 10px 2px #000'
};

const groupStyle = {
  margin: "10px auto 10px auto",
  padding: "10px 5px 15px 5px",
  // boxShadow: "0px 5px 10px 2px #000",
  width: "400px",
  background: "#fff"
};

export default class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNotValid: false,
      web3: this.props.myweb3
    };
    this.login = this.login.bind(this);
    this.election = this.props.mycon;
    this.toggleUserNotValid = this.toggleUserNotValid.bind(this);
    // this.testing = this.testing.bind(this);
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

  // testing() {
  //   alert(this.state.username);
  //   alert(this.state.password);
  // }

  login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // this.setState({
    //   username: document.getElementById("username").value,
    //   password: document.getElementById("password").value
    // });
    // this.testing();
    this.electionInstance
      .verifyAdmin(String(username), String(password))
      .then(isValid => {
        if (isValid) {
          this.props.changePage(7);
        } else {
          this.setState({ userNotValid: true });
        }
      });
    //Verify admin and set this.state.validAdmin to "true" to redirect to admin page..
  }

  toggleUserNotValid() {
    this.setState({ userNotValid: false });
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }

  render() {
    // if(this.state.validAdmin){
    //     return (
    //         <Redirect to = '/admin/constituency' />
    //     )
    // }

    return (
      <div style={style} className='text-center'>
        <div>
          <h2 className='text-center' style={{ fontFamily: "sans-serif" }}>
            Sign In to add Constituencies and Candidates
          </h2>
        </div>
        <br />
        <div style={groupStyle}>
          <div>
            <label style={{ margin: "5px" }}>Username</label>
            <input id='username' type='text' />
            <br />
            <br />
            <label style={{ margin: "5px" }}>Password</label>
            <input id='password' type='password' />
          </div>
          <br />
          <div>
            <button
              className='btn btn-success'
              style={{ fontFamily: "monospace" }}
              onClick={this.login}
            >
              SIGN IN
            </button>
          </div>
        </div>
        {this.state.userNotValid && (
          <div>
            <Modal isOpen={this.state.userNotValid}>
              <ModalHeader> Username or password is incorrect! </ModalHeader>
              <ModalFooter>
                <Button className='btn-retry' onClick={this.toggleUserNotValid}>
                  Retry
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        )}
      </div>
    );
  }
}
