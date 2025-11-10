// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title CGBallotChain - Simple voting contract with overseers
/// @notice Owner can add candidates and overseers. Voters can cast multiple votes each.
contract CGBallotChain {
    address public owner;
    mapping(address => bool) public overseer;

    // State variables to store the last winner's information
    uint public lastWinnerId = type(uint).max; // Using max uint as a 'null' value since 0 is a valid ID
    string public lastWinnerName = "";

    struct Candidate {
        uint id;
        string name;
        string info;
        uint voteCount;
    }

    // candidate storage
    mapping(uint => Candidate) private candidates;
    uint public candidatesCount;

    // events
    event CandidateAdded(uint indexed id, string name);
    event Voted(address indexed voter, uint indexed candidateId);
    event OverseerAdded(address indexed addr);
    event OverseerRemoved(address indexed addr);
    event VoteReset(uint indexed winnerId, string winnerName);

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
    function vote(uint candidateId) external {
        require(candidateId < candidatesCount, "Invalid candidate");
        candidates[candidateId].voteCount += 1;

        emit Voted(msg.sender, candidateId);
    }

    /// @notice Get candidate details
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
    
    /// @notice Returns the ID and name of the last declared winner.
    /// Returns a placeholder ID and empty string if no election has concluded.
    function getLastWinner() 
        external 
        view 
        returns (uint id, string memory name) 
    {
        return (lastWinnerId, lastWinnerName);
    }

    /// @notice Returns arrays of all candidates (names, infos, voteCounts)
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

    /// @notice Finds the winner and resets all vote counts. (Owner or Overseer only)
    function declareWinnerAndReset() external onlyOverseerOrOwner {
        require(candidatesCount > 0, "No candidates to declare winner");
        
        uint winningVoteCount = 0;
        uint[] memory topCandidates = new uint[](candidatesCount); 
        uint topCandidateCount = 0;
        uint finalWinnerId = type(uint).max; // Default to 'no winner'

        // 1. Find the maximum vote count
        for (uint i = 0; i < candidatesCount; i++) {
            uint currentVotes = candidates[i].voteCount;
            if (currentVotes > winningVoteCount) {
                winningVoteCount = currentVotes;
            }
        }
        
        // 2. Identify all candidates with the winning vote count (potential ties)
        if (winningVoteCount > 0) {
            for (uint i = 0; i < candidatesCount; i++) {
                if (candidates[i].voteCount == winningVoteCount) {
                    topCandidates[topCandidateCount] = i;
                    topCandidateCount++;
                }
            }
        }

        // 3. Handle Ties or Single Winner
        if (topCandidateCount == 1) {
            // Case: Single undisputed winner
            finalWinnerId = topCandidates[0];
        } else if (topCandidateCount > 1) {
            // Case: Tie-breaker logic using pseudo-random number
            uint randomSeed = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
            uint winnerIndexInTiedGroup = randomSeed % topCandidateCount;
            finalWinnerId = topCandidates[winnerIndexInTiedGroup];
        } 
        
        // 4. Update state with winner info and Reset Votes
        if (finalWinnerId != type(uint).max) {
            // Store winner data
            lastWinnerId = finalWinnerId;
            lastWinnerName = candidates[finalWinnerId].name;

            // Emit Event
            emit VoteReset(finalWinnerId, lastWinnerName);
        } else {
            // If no votes cast (winningVoteCount == 0), clear previous winner data just in case
            lastWinnerId = type(uint).max;
            lastWinnerName = "";
        }
        
        // Reset Votes for everyone (regardless of winner)
        for (uint i = 0; i < candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
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