// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Votes is IERC20 {
    function getPastVotes(address, uint256) external view returns (uint256);
}

/// @title Voting with ERC-20 token based voting power.
/// @notice You can use this contract for creating ballot and allow voting with ERC-20 token based voting power
contract CustomBallot {
    /// @notice Event which contains important values when calling vote function
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    /// @dev This declares a state variable that stores a uint256 for each possible address.
    /// @notice Mapping of spent vote power for each address.
    mapping(address => uint256) public spentVotePower;

    /// @dev A dynamically-sized array of `Proposal` structs.
    /// @notice List of proposals available for voting.
    Proposal[] public proposals;

    /// @notice ERC20 votes extension contract to support voting
    IERC20Votes public voteToken;

    /// @notice reference block which the snapshot for voting power is taken
    uint256 public referenceBlock;

    /// @notice Constructor function
    /// @dev Create a new ballot to choose one of `proposalNames`.
    /// @param proposalNames List of proposal names
    /// @param _voteToken ERC20 Token address for generating voting power
    constructor(bytes32[] memory proposalNames, address _voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number - 1;
    }

    /// @notice Give your vote (within the limits of your voting power) to proposal `proposals[proposal].name`.
    /// @param proposal Index of the proposal chosen
    /// @param amount voting power value to be used for proposal chosen
    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower(msg.sender);
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    /// @dev Computes the winning proposal taking all previous votes into account.
    /// @notice Get the winning proposal
    /// @return winningProposal_ Index of the winning proposal
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @dev Calls winningProposal() function to get the index of the winner contained in the proposals array and then returns the name of the winner
    /// @notice Get the winning proposal name
    /// @return winnerName_ name of the winner
    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// @dev Calculates the available voting power according to snapshot taken for ERC20 Voting extension - used voting power
    /// @notice Get the available voting power
    /// @param _sender address of the voter
    /// @return votingPower_ number value of voting power available
    function votingPower(address _sender)
        public
        view
        returns (uint256 votingPower_)
    {
        votingPower_ =
            voteToken.getPastVotes(_sender, referenceBlock) -
            spentVotePower[_sender];
    }
}
