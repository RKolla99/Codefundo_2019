import React from "react";
//import { Redirect } from 'react-router-dom';

const style = {
  margin: "auto auto auto auto",
  padding: "10px 5px 15px 5px"
  // boxShadow: '0px 5px 10px 2px #000'
};

const groupStyle = {
  margin: "10px auto 10px auto",
  padding: "10px 5px 15px 5px",
  boxShadow: "0px 5px 10px 2px #000",
  width: "400px"
};

export default class AdminLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      validAdmin: false
    };
    this.login = this.login.bind(this);
  }

  login() {
    this.setState({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      validAdmin: true //uncomment line while testing
    });

    //Verify admin and set this.state.validAdmin to "true" to redirect to admin page..
  }

  render() {
    // if(this.state.validAdmin){
    //     return (
    //         <Redirect to = '/admin/constituency' />
    //     )
    // }

    return (
      <div style={style} className="text-center">
        <div>
          <h2 className="text-center" style={{ fontFamily: "monospace" }}>
            Sign In to add Constituencies and Candidates
          </h2>
        </div>
        <br />
        <div style={groupStyle}>
          <div>
            <label style={{ margin: "5px" }}>Username</label>
            <input id="username" type="text" />
            <br />
            <br />
            <label style={{ margin: "5px" }}>Password</label>
            <input id="password" type="password" />
          </div>
          <br />
          <div>
            <button
              className="btn btn-success"
              style={{ fontFamily: "monospace" }}
              onClick={this.login}
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }
}
