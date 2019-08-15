import React from "react";
import AddCandidate from "../components/addCandidate";
import { Button, Label, Alert, Modal, ModalHeader } from "reactstrap";

const constitutionStyle = {
  width: "60%",
  margin: "10px auto 5px auto",
  padding: "10px 10px 10px 10px",
  // border: '1px black solid',
  boxShadow: "0px 5px 10px 2px #000"
};

const labelStyle = {
  display: "inline-block",
  width: "180px",
  padding: "5px"
};

const alertStyle = {
  width: "80%",
  margin: "10px auto 15px auto"
};

const buttonsStyle = {
  width: "40%",
  margin: "10px auto 5px auto",
  overflow: "auto"
};

class Constitution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCandidateDetails: false,
      showConstitutionDetails: true,
      addCandidate: false,
      candidates: Object(),
      constitution: Object(),
      submit: false
    };
    this.election = this.props.mycon;
    this.candidateDetails = this.candidateDetails.bind(this);
    this.addCandidate = this.addCandidate.bind(this);
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    this.election.deployed().then(electionInstance => {
      this.electionInstance = electionInstance;
      // this.watchEvents();
      this.electionInstance.candidatesInformation(1, 0).then(candidate => {
        alert(candidate);
      });
    });
  }
  candidateDetails() {
    const const_name = document.getElementById("const_name").value;
    const const_id = document.getElementById("const_id").value;

    this.setState({
      showCandidateDetails: true,
      showConstitutionDetails: false,
      addCandidate: false,
      constitution: {
        [const_id]: const_name
      }
    });
  }

  addCandidate() {
    if (this.state.addCandidate) {
      const cand_name = document.getElementById("cand_name").value;
      const cand_id = document.getElementById("cand_id").value;

      const candidate = {
        [cand_id]: cand_name
      };

      this.setState({
        candidates: { ...this.state.candidates, ...candidate }
      });

      document.getElementById("cand_name").value = "";
      document.getElementById("cand_id").value = "";
    }

    this.setState({
      addCandidate: true
    });
  }

  submit() {
    this.setState({
      submit: true
    });
  }

  render() {
    return (
      <div>
        {this.state.showConstitutionDetails && (
          <div id="constitution_details" style={constitutionStyle}>
            <Label for="const_name" style={labelStyle}>
              Constitution Name
            </Label>
            <input id="const_name" />
            <br />
            <Label for="const_id" style={labelStyle}>
              Constitution ID
            </Label>
            <input id="const_id" />
            <br />
            <div className="text-right">
              <Button size="sm" onClick={this.candidateDetails}>
                NEXT
              </Button>
            </div>
          </div>
        )}
        {!this.state.showConstitutionDetails && (
          <div className="text-center">
            <Alert color="success" style={alertStyle}>
              Constitution successfully added!
            </Alert>
          </div>
        )}
        {this.state.addCandidate && (
          <div>
            <AddCandidate />
          </div>
        )}
        {this.state.showCandidateDetails && (
          <div className="text-center" style={buttonsStyle}>
            <div className="float-left">
              <Button className="primary" onClick={this.addCandidate}>
                Add Candidate
              </Button>
            </div>
            {this.state.addCandidate && (
              <div className="float-right">
                <Button className="btn-success" onClick={this.submit}>
                  DONE
                </Button>
              </div>
            )}
            {this.state.submit && (
              <div>
                <Modal isOpen={true} toggle={true}>
                  <ModalHeader>Details Saved Successfully!</ModalHeader>
                </Modal>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Constitution;
