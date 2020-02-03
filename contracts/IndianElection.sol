pragma solidity ^0.5.0;

contract IndianElection {
    struct Candidate {
        uint256 candidateId;
        uint256 candidateVoteCount;
    }

    mapping(uint256 => Candidate) public candidatesList;
    mapping(uint256 => bool) public voterEntry;
    mapping(string => bytes32) adminCredentials;

    mapping(uint256 => string) public constituencyFileHash;

    // Set constituency file hash
    function setConstituencyFileHash(uint256 constId, string memory fileHash)
        public
    {
        constituencyFileHash[constId] = fileHash;
    }

    function addAdmin(string memory username, string memory password) public {
        adminCredentials[username] = keccak256(abi.encodePacked(password));
    }

    function verifyAdmin(string memory username, string memory password)
        public
        view
        returns (bool)
    {
        bytes32 stored = adminCredentials[username];
        bytes32 given = keccak256(abi.encodePacked(password));
        return stored == given;
    }

    function addCandidate(uint256 candidateId) public {
        Candidate memory ElectionCandidate = Candidate(candidateId, 0);
        candidatesList[candidateId] = ElectionCandidate;
    }

    function vote(uint256 _candidateId, uint256 aadhaarNo) public {
        require(!voterEntry[aadhaarNo], "Voter has voted");

        voterEntry[aadhaarNo] = true;
        candidatesList[_candidateId].candidateVoteCount += 1;
    }

    function returnVoteCount(uint256 _candidateId)
        public
        view
        returns (uint256)
    {
        return candidatesList[_candidateId].candidateVoteCount;
    }
}
