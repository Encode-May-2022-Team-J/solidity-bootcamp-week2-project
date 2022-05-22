// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Votes is IERC20 {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract CustomBallot {
    event Voted(
        address indexed voter,
        uint256 indexed proposal,
        uint256 weight,
        uint256 proposalVotes
    );

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    function setAnything(uint256 _test) public payable {
        myAnything = _test;
    }

    mapping(address => uint256) public spentVotePower;

    uint256 public myAnything;
    Proposal[] public proposals;
    IERC20Votes public voteToken;
    uint256 public referenceBlock;

    constructor(bytes32[] memory proposalNames, address _voteToken) {
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
        voteToken = IERC20Votes(_voteToken);
        referenceBlock = block.number - 1;
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votingPowerAvailable = votingPower(msg.sender);
        require(votingPowerAvailable >= amount, "Has not enough voting power");
        spentVotePower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
        emit Voted(msg.sender, proposal, amount, proposals[proposal].voteCount);
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

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
