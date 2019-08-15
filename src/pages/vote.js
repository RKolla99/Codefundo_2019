import React from 'react';
import {Table, Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'


const buttonStyle = {
    width: '80px',

}

const tableDivStyle = {
    padding: '10px',
    margin: '10px auto 10px auto',
    boxShadow: '0px 5px 15px 2px #000',
    width: '70%'

}

export default class Vote extends React.Component {

    constructor() {
        super();
        this.state = {
            candidates: {
                1: 'John',
                2: 'Jake',
                3: 'Jane'
            },
            confirmVoteModal: false,
            tempCandidateName: '',
            tempCandidateID: '',
            voteSuccessModal: false
        }

        this.confirmVote = this.confirmVote.bind(this);
        this.toggle = this.toggle.bind(this);
        this.cancelVote = this.cancelVote.bind(this);
        this.submitVote = this.submitVote.bind(this);
    
    }

    confirmVote(event) {
        const cand_name = event.target.value
        const cand_id = event.target.id
        this.setState({
            confirmVoteModal: true,
            tempCandidateName: cand_name,
            tempCandidateID: cand_id
        })
    }
    
    toggle() {
        this.setState( prevState => ({
            confirmVoteModal: !prevState.confirmVoteModal
        }))
    }

    submitVote() {
        this.setState({
            votedCandidateName : this.state.tempCandidateName,
            votedCandidateID : this.state.tempCandidateID,
            voteSuccessModal: true
        })
        this.toggle()
    }

    cancelVote(){
        this.setState({
            tempCandidateName: '',
            tempCandidateID: ''
        })
        this.toggle()
    }

    render() {
        var candidates_arr = []
        var count=1
        for(var i in this.state.candidates){
            candidates_arr.push(
                <tr key={i+1}>
                    <td>{count}</td>
                    <td>{this.state.candidates[i]}</td>
                    <td>{i}</td>
                    <td className="text-center">
                        <Button id={i} value={this.state.candidates[i]} style={buttonStyle} size="sm" className="btn-success" onClick={this.confirmVote}>VOTE</Button>
                    </td>
                </tr>
            )
            count ++;
        }

        return (
            <div >
                <div style={{marginTop:'15px'}}>
                    <h2 className="text-center">
                        Vote for your favourite candidate
                    </h2>
                </div>
                <br />
                <div style={tableDivStyle}>
                    <Table bordered>
                        <thead>
                            <tr className="text-center">
                                <th>Sl No.</th>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates_arr}
                        </tbody>
                    </Table>
                    <div>
                        <Modal isOpen={this.state.confirmVoteModal} toggle={this.toggle}>
                            <ModalHeader toggle={this.toggle}> Confirm your vote! </ModalHeader>
                            
                            <ModalBody>
                                Are you sure you want to cast your vote to <b>{this.state.tempCandidateName}</b> ?
                            </ModalBody>
                            
                            <ModalFooter>
                                <Button className="btn-success" onClick={this.submitVote}>Confirm Vote</Button>
                                <Button onClick={this.cancelVote} className="btn-danger">Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
                    <Modal isOpen={this.state.voteSuccessModal}>
                        <ModalHeader>
                            Your vote has been successfully casted to <b>{this.state.votedCandidateName}</b>
                        </ModalHeader>
                    </Modal>
            </div>
        )
    }
}