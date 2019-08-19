import React from "react";
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

export default class AdminOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.electionSetup = this.electionSetup.bind(this);
    this.viewResults = this.viewResults.bind(this);
  }

  electionSetup() {
    this.props.changePage(1);
  }

  viewResults() {
    // Add argument according to page index of results page
    this.props.changePage(6);
  }

  render() {
    return (
      <div style={{ paddingTop: "20%" }}>
        <div style={centerStyle} className="">
          <div className="text-center">
            <h1 className="display-4" style={{ fontFamily: "monospace" }}>
              Choose action
            </h1>
          </div>
          <br />
          <div className="text-center">
            <div style={buttonStyle}>
              <Button className="btn-success" onClick={this.electionSetup}>
                Election Setup
              </Button>
            </div>
            <div style={buttonStyle}>
              <Button className="btn-primary" onClick={this.viewResults}>
                View Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
