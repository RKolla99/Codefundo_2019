import React from "react";
import axios from "axios";
import { Button, Label, Table, Input } from "reactstrap";

const constituencyStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  // margin: '40px',
  padding: "40px"
  // backgroundColor: 'white'
};

const constituencyInputStyle = {
  margin: "auto",
  marginBottom: "20px",
  width: "300px",
  // backgroundColor: 'white',
  padding: "20px"
};

class CandidateDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      show_candidate_list: false,
      candidates_total: 0,
      candidate_details: [],
      expanded_rows: []
    };
    this.getCandidateList = this.getCandidateList.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.getPartyInfo = this.getPartyInfo.bind(this);
    this.getPromises = this.getPromises.bind(this);
  }

  async getPartyInfo(partyId) {
    const partyInformation = await axios.get(
      "http://localhost:5000/api/party/" + partyId
    );
    return partyInformation.data;
  }

  // used to populate candidate list
  async getCandidateList() {
    const constId = document.getElementById("const_id").value;
    const candidateInformation = await axios.get(
      "http://localhost:5000/api/candidate/constituency/" + constId
    );

    let candidateDetails = candidateInformation.data;

    console.log(candidateDetails[0]);
    let partyInfo;
    for (var i = 0; i < candidateDetails.length; i++) {
      candidateDetails[i].id = i + 1;
      partyInfo = await this.getPartyInfo(candidateDetails[i].partyId);
      candidateDetails[i].partyName = partyInfo.name;
      candidateDetails[i].partyLogo = partyInfo.logo;
    }

    console.log(candidateDetails);
    // alert(candidateDetails);

    this.setState({
      show_candidate_list: true,
      candidates_total: candidateDetails.length,
      candidate_details: candidateDetails
    });
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expanded_rows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expanded_rows: newExpandedRows });
  }

  getPromises(item, choice) {
    const listItems1 = item.promises.made.map(data => <li>{data}</li>);
    const listItems2 = item.promises.held.map(data => <li>{data}</li>);
    if (choice) {
      return <ul>{listItems1}</ul>;
    } else {
      return <ul>{listItems2}</ul>;
    }
  }

  renderRow(item) {
    const clickCallback = () => this.handleRowClick(item.id);
    const itemRows = [
      <tr onClick={clickCallback} key={"row-data-" + item.id}>
        <td align='center' style={{ width: "100px" }}>
          <img
            src={`data:image/jpg;base64,${item.partyLogo}`}
            width='40px'
            height='40px'
            alt=''
          />
        </td>
        <td align='center'>{item.name}</td>
      </tr>
    ];

    if (this.state.expanded_rows.includes(item.id)) {
      itemRows.push(
        <tr key={"row-expanded-" + item.id} style={{ height: "auto" }}>
          <td style={{ width: "100px" }}>
            <div style={{ maxWidth: "100px" }}>
              <img src={item.photo} width='80px' height='80px' alt='' /> <br />
              <span style={{ margin: "auto" }}>
                <b> {item.partyName} </b>
              </span>
            </div>
          </td>
          <td>
            <div style={{ width: "100%" }}>
              <span>
                <b>Promises made:</b>
              </span>
              <br />
              <span>&nbsp;&nbsp;</span>
              {this.getPromises(item, 1)}
              <br />
              <span>
                <b>Promises kept:</b>
              </span>{" "}
              <br />
              <div>&nbsp;&nbsp;{this.getPromises(item, 0)}</div>
              <h6>{item.promises.description}</h6>
              <br />
              <div>
                <h5>
                  <b>Fund Utilization: </b>
                </h5>
                <p>sanctioned: {item.fundutilisation.sanctioned} rupees</p>
                <p>used: {item.fundutilisation.used} rupees</p>
              </div>
              <div>
                <h5>
                  <b>Criminal record: </b>
                </h5>
                <p>Number of cases: {item.criminalrecord.noCases}</p>
                <p>description : {item.criminalrecord.description}</p>
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return itemRows;
  }

  render() {
    let candidate_rows = [];

    this.state.candidate_details.forEach(item => {
      console.log(item);
      const row = this.renderRow(item);
      candidate_rows = candidate_rows.concat(row);
    });

    return (
      <div>
        <div style={constituencyStyle}>
          <div style={constituencyInputStyle}>
            <Label for='const_id'> Constituency ID </Label>
            <Input id='const_id' />
            <br />
            <Button value='Submit' onClick={this.getCandidateList}>
              {" "}
              Submit{" "}
            </Button>
          </div>
          <br />
          {this.state.show_candidate_list && (
            <div
              id='candidate_list'
              style={{ width: "100%", backgroundColor: "white" }}
            >
              <Table
                bordered
                hover
                style={{ width: "100%", height: "auto", tableLayout: "fixed" }}
              >
                <tbody>{candidate_rows}</tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CandidateDetails;
