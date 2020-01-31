import React from "react";
// import {Link} from 'react-router-dom';
import { Button } from "reactstrap";

const centerStyle = {
  margin: "auto",
  paddingTop: "20px",
  overflow: "auto",
  width: "500px",
  // boxShadow: "0px 5px 10px 2px #000"
  background: "#fff"
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px"
};
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});
export default class fileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.voterLogin = this.voterLogin.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      console.log("buffer", this.props.getBuffer());
    };
  }

  onSubmit(event) {
    console.log(this.props.ipfs);
    console.log(ipfs);
    console.log(this.props.getBuffer());
    event.preventDefault();
    console.log("Submitting file to ipfs...");
    ipfs.add(this.props.getBuffer(), (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }
      //   this.state.contract.methods
      //     .set(result[0].hash)
      //     .send({ from: this.state.account })
      //     .then(r => {
      //       return this.setState({ memeHash: result[0].hash });
      //     });
    });
  }

  render() {
    return (
      <div style={{ paddingTop: "20%" }}>
        <div style={centerStyle} className=''>
          <div className='text-center'>
            <h1 className='display-4' style={{ fontFamily: "sans-serif" }}>
              Indian Elections
            </h1>
          </div>
          <br />
          <div className='text-center'>
            <div style={buttonStyle}>
              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
