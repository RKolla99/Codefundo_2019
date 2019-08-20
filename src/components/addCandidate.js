import React from "react";
import { Label } from "reactstrap";

const labelStyle = {
  display: "inline-block",
  width: "180px",
  padding: "5px"
};

const candidateStyle = {
  width: "60%",
  margin: "10px auto 15px auto",
  padding: "10px 10px 10px 10px",
  // border: '1px black solid',
  // boxShadow: "0px 5px 10px 2px #000"
  background: "#fff"
};

export default class AddCandidate extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="text-center" style={candidateStyle}>
        <Label for="cand_name" style={labelStyle}>
          Candidate Name
        </Label>
        <input id="cand_name" />
        <br />
        <Label for="cand_id" style={labelStyle}>
          Candidate ID
        </Label>
        <input id="cand_id" />
        <br />
      </div>
    );
  }
}
