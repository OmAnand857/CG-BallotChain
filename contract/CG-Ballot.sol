// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title CGBallotChain - Simple voting contract with overseers
/// @notice Owner can add candidates and overseers. Voters can cast one vote each.
contract CGBallotChain {
    address public owner;
    mapping(address => bool) public overseer;

    struct Candidate {
        uint id;
        string name;
        string info;
        uint voteCount;
    }

    // candidate storage
    mapping(uint => Candidate) private candidates;
    uint public candidatesCount;

    // voting tracking
    mapping(address => bool) public hasVoted;

    // events
    event CandidateAdded(uint indexed id, string name);
    event Voted(address indexed voter, uint indexed candidateId);
    event OverseerAdded(address indexed addr);
    event OverseerRemoved(address indexed addr);

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyOverseerOrOwner() {
        require(msg.sender == owner || overseer[msg.sender], "Only overseer or owner");
        _;
    }

    /// @dev internal helper declared before constructor so constructor can call it safely
    function _addCandidate(string memory name, string memory info) internal {
        uint id = candidatesCount;
        candidates[id] = Candidate({
            id: id,
            name: name,
            info: info,
            voteCount: 0
        });
        candidatesCount++;
        emit CandidateAdded(id, name);
    }

    /// @notice Create contract and optionally initialize candidates
    /// @param names array of candidate names (can be empty)
    /// @param infos array of candidate info strings (must match names length)
    constructor(string[] memory names, string[] memory infos) {
        require(names.length == infos.length, "Names/infos length mismatch");
        owner = msg.sender;

        for (uint i = 0; i < names.length; i++) {
            _addCandidate(names[i], infos[i]);
        }
    }

    /// @notice Add a single candidate (owner only)
    function addCandidate(string memory name, string memory info) external onlyOwner {
        _addCandidate(name, info);
    }

    /// @notice Bulk initialize candidates after deployment (owner only)
    function initializeCandidates(string[] memory names, string[] memory infos) external onlyOwner {
        require(names.length == infos.length, "Names/infos length mismatch");
        for (uint i = 0; i < names.length; i++) {
            _addCandidate(names[i], infos[i]);
        }
    }

    /// @notice Cast vote for a candidate id
    /// @param candidateId the id (0..candidatesCount-1) of candidate to vote for
    function vote(uint candidateId) external {
        require(candidateId < candidatesCount, "Invalid candidate");
        require(!hasVoted[msg.sender], "Already voted");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;

        emit Voted(msg.sender, candidateId);
    }

    /// @notice Get candidate details
    /// @param candidateId id of candidate
    /// @return name The candidate's name.
    /// @return info Additional information about the candidate.
    /// @return voteCount The total number of votes for the candidate.
    
    function getCandidate(uint candidateId)
        external
        view
        returns (string memory name, string memory info, uint voteCount)
    {
        require(candidateId < candidatesCount, "Invalid candidate");
        Candidate storage c = candidates[candidateId];
        return (c.name, c.info, c.voteCount);
    }

    /// @notice Get vote count for a candidate (owner or overseer)
    function getVoteCount(uint candidateId) external view onlyOverseerOrOwner returns (uint) {
        require(candidateId < candidatesCount, "Invalid candidate");
        return candidates[candidateId].voteCount;
    }

    /// @notice Returns arrays of all candidates (names, infos, voteCounts)
    /// Useful for UIs to fetch full list in one call
    function getAllCandidates()
        external
        view
        returns (string[] memory names, string[] memory infos, uint[] memory votes)
    {
        uint n = candidatesCount;
        names = new string[](n);
        infos = new string[](n);
        votes = new uint[](n);

        for (uint i = 0; i < n; i++) {
            Candidate storage c = candidates[i];
            names[i] = c.name;
            infos[i] = c.info;
            votes[i] = c.voteCount;
        }
        return (names, infos, votes);
    }

    /// @notice Owner can add an overseer
    function addOverseer(address addr) external onlyOwner {
        overseer[addr] = true;
        emit OverseerAdded(addr);
    }

    /// @notice Owner can remove an overseer
    function removeOverseer(address addr) external onlyOwner {
        overseer[addr] = false;
        emit OverseerRemoved(addr);
    }

    /// @notice Transfer ownership (owner only)
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
}