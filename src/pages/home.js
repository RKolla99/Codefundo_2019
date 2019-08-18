import React from "react";
// import {Link} from 'react-router-dom';
import { Button } from "reactstrap";

const centerStyle = {
  margin: "auto",
  paddingTop: "20px",
  overflow: "auto",
  width: "500px",
  boxShadow: "0px 5px 10px 2px #000"
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px"
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.voterLogin = this.voterLogin.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
  }
  voterLogin() {
    this.props.changePage(2);
  }
  adminLogin() {
    this.props.changePage(1);
  }
  render() {
    return (
      <div style={{ paddingTop: "20%" }}>
        <div style={centerStyle} className="">
          <div className="text-center">
            <h1 className="display-4" style={{ fontFamily: "monospace" }}>
              Name of App
            </h1>
          </div>
          <br />
          <div className="text-center">
            <div style={buttonStyle}>
              <Button className="btn-success" onClick={this.voterLogin}>
                Voter Login
              </Button>
            </div>
            <div style={buttonStyle}>
              <Button className="btn-primary" onClick={this.adminLogin}>
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
