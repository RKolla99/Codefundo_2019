pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract IndianElection{

    //Set of States
    enum StateType { Request, Respond}

    //List of properties
    StateType public  State;
    address public  Requestor;
    address public  Responder;

    string public RequestMessage;
    string public ResponseMessage;

    event StateChanged(string stateData);

    // Voters DigitalId

    struct DigitalId{
        uint aadhaarNo;
        string fingerPrint;
        string retinaInfo;
        uint constituencyId;
    }

    // Candidate Model

    struct Candidate {
        uint candidateId;
        string candidateName;
        uint candidateVoteCount;
    }

    // Voter List
    mapping(uint => DigitalId) public voterList;
    uint public eligibleVoters;

    // Mapping to store voters who have voted (adhaar to boolean)
    // This is for all constituencies(entire country)
    mapping(uint => bool) public voterEntry;

    // Constituency model

    struct Constituency {
        uint constituencyId;
        string constituencyName;
        uint candidateCount;
        
    }

    mapping(uint => Constituency) public constituencyList;
    // ConstituencyId -> Candidates Array
    mapping(uint => Candidate[]) public candidatesInformation; 
    // constructor function
    constructor() public
    {
        Requestor = msg.sender;
        RequestMessage = "Hello";
        State = StateType.Request;

        emit StateChanged('Request');
    }

    // call this function to send a request
    function SendRequest(string memory requestMessage) public
    {
        if (Requestor != msg.sender)
        {
            revert("Error");
        }

        RequestMessage = requestMessage;
        State = StateType.Request;
    }

    // call this function to send a response
    function SendResponse(string memory responseMessage) public
    {
        Responder = msg.sender;

        // call ContractUpdated() to record this action
        ResponseMessage = responseMessage;
        State = StateType.Respond;

        emit StateChanged('Response');
    }

    function getMessage() public view returns (string memory)
    {
        if (State == StateType.Request)
            return RequestMessage;
        else
            return ResponseMessage;
    }

    // Step 1 : adding all existing constituencies with candidates info
    function addConstituency(uint constituencyId, string memory constituencyName, uint candidateCount) public
    {
        
        constituencyList[constituencyId] = Constituency(constituencyId, constituencyName, candidateCount);

    }

    // Step 2 : adding candidates to constituencies 
    function addCandidate(uint constituencyId,uint candidateId,string memory candidateName) public
    {
        Candidate memory ElectionCandidate = Candidate(candidateId,candidateName,0);
        candidatesInformation[constituencyId].push(ElectionCandidate);
        constituencyList[constituencyId].candidateCount += 1;
    }
    function returnCandidateInfo(uint constituencyId,uint candidateId) public view returns (Candidate memory){
        return candidatesInformation[constituencyId][candidateId];
    }
    
    function returnContituencyInfo(uint constituencyId) public view returns (Constituency memory){
        return constituencyList[constituencyId];
    }

    // Step 3 : initialize the voting list
    function addVoterToList(uint aadhaarNo, string memory fingerPrint, string memory retinaInfo, uint constituencyId) public
    {
        voterEntry[aadhaarNo] = false;
        voterList[aadhaarNo] = DigitalId(aadhaarNo, fingerPrint, retinaInfo, constituencyId);
        eligibleVoters += 1;
    }

    // Step 4 : Verify the details of the voter
    function verifyVoter(uint aadhaarNo, string memory fingerPrint, string memory retinaInfo, uint constituencyId) public view returns (bool)
    {
        // Voter has not voted before
        require(!voterEntry[aadhaarNo], "Error");
        DigitalId memory temp = voterList[aadhaarNo];
        // Comparision through keccak256() instead of iterating to save time and gas cost

        bytes32 b1 = keccak256(abi.encodePacked(temp.aadhaarNo, temp.fingerPrint, temp.retinaInfo, temp.constituencyId));
        bytes32 b2 = keccak256(abi.encodePacked(aadhaarNo, fingerPrint, retinaInfo, constituencyId));

        return b1 == b2;
        // Iterate through the eligle voter info and check if there is a match
    }

    // Step 5 : Vote for a candidate
    function vote(uint _candidateId, uint adhaarNo, uint constituencyId) public
    {
        require(!voterEntry[adhaarNo]);
        
        // Mark the user has now voted
        voterEntry[adhaarNo] = true;

        // Increment the vote count for the candidate chosen
       candidatesInformation[constituencyId][_candidateId].candidateVoteCount += 1;
    }

    function returnVoteCount(uint _candidateId, uint constituencyId) public view returns (uint)
    {
        return candidatesInformation[constituencyId][_candidateId].candidateVoteCount ;
    }

}