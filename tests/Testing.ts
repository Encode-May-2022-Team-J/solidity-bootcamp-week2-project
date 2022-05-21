import { expect } from "chai";
// eslint-disable-next-line node/no-unpublished-import
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot, MyToken } from "../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const PROPOSAL_TO_VOTE = 0;
const TOKEN_AMOUNT = 100;

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function vote(
  ballotContract: CustomBallot,
  voter: any,
  proposal: number,
  amount: any
) {
  const tx = await ballotContract.connect(voter).vote(proposal, amount);
  await tx.wait();
}

async function delegate(tokenContract: MyToken, delegatee: string) {
  const tx = await tokenContract.delegate(delegatee);
  await tx.wait();
}

describe("Test Ballot", () => {
  let ballotContract: CustomBallot;
  let ballotFactory: any;
  let tokenContract: MyToken;
  let tokenContractFactory: any;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    [ballotFactory, tokenContractFactory] = await Promise.all([
      ethers.getContractFactory("CustomBallot"),
      ethers.getContractFactory("MyToken"),
    ]);
    tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();

    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS),
      tokenContract.address
    );
    await ballotContract.deployed();

    const minterRole = await tokenContract.MINTER_ROLE();
    const tx1 = await tokenContract.grantRole(
      minterRole,
      ballotContract.address
    );
    await tx1.wait();
  });

  describe("when the ballot contract is deployed", async () => {
    it("should have the voteToken address set", async () => {
      expect(await ballotContract.voteToken()).to.eq(tokenContract.address);
    });

    it("has the provided proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });
  });


  describe("When a vote is cast without voting rights", function () {
    it("should revert if voting power has not been delegated", async () => {
      await expect(
        vote(ballotContract, accounts[0], PROPOSAL_TO_VOTE, TOKEN_AMOUNT)
      ).to.be.revertedWith("Has not enough voting power");
    });

    it("should revert if account has no balance", async () => {
      await delegate(tokenContract, accounts[1].address);

      await expect(
        vote(ballotContract, accounts[0], PROPOSAL_TO_VOTE, TOKEN_AMOUNT)
      ).to.be.revertedWith("Has not enough voting power");
    });
  });

  describe("when a vote is cast with appropriate voting rights", () => {
    let user: any;

    beforeEach(async () => {
      user = accounts[0];

      await delegate(tokenContract, user.address);

      const tx = await ballotContract.connect(user).purchaseVotes({
        value: TOKEN_AMOUNT,
      });
      await tx.wait();
    });

    it("should increase spentVotePower by vote amount", async () => {
      const balanceBN = await tokenContract.balanceOf(user.address);
      // const balance = Number(balanceBN));
      const balance = Number(balanceBN);
      expect(balance).to.eq(TOKEN_AMOUNT);

      // votingPower
      const votingPowBN = await ballotContract.connect(user).votingPower();
      const votingPow = Number(votingPowBN);

      expect(votingPow).to.eq(TOKEN_AMOUNT);

      const origSpentVotePower = await ballotContract.spentVotePower(
        user.address
      );

      expect(origSpentVotePower).eq(0);

      await vote(ballotContract, user, PROPOSAL_TO_VOTE, 1);

      expect(await ballotContract.spentVotePower(accounts[0].address)).gt(
        origSpentVotePower
      );
    });

    it("should reduce voting power by amount", async () => {
      const origVotePowerBN = await ballotContract.connect(user).votingPower();
      const origVotePower = Number(origVotePowerBN);

      const origVotePowerSpent = await ballotContract.spentVotePower(
        user.address
      );

      await vote(ballotContract, user, PROPOSAL_TO_VOTE, 1);

      const afterVotePowerBN = await ballotContract.connect(user).votingPower();
      const afterVotePower = Number(afterVotePowerBN);

      const afterVotePowerSpent = await ballotContract.spentVotePower(
        user.address
      );

      expect(origVotePower).gt(origVotePowerSpent);
      expect(afterVotePowerSpent).gt(origVotePowerSpent);
      expect(origVotePower).gt(afterVotePower);
    });
  });
});
