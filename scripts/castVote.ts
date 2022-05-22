import { Contract, ethers } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot } from "../typechain";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import "dotenv/config";

const setListeners = (
  ballotContract: CustomBallot,
  provider: ethers.providers.BaseProvider
) => {
  const iface = new ethers.utils.Interface(ballotJson.abi);
  const eventFilter = ballotContract.filters.Voted();
  provider.on(eventFilter, async (log) => {
    const parsedLog = iface.parseLog(log);
    const proposalName = await ballotContract.proposals(
      parsedLog.args.proposal
    );
    console.log(
      `Voted event: ${
        parsedLog.args.voter
      } voted for ${ethers.utils.parseBytes32String(
        proposalName.name
      )} with amount ${ethers.utils.formatEther(parsedLog.args.weight)}`
    );
  });
};

const attachContract = () => {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten", {
    etherscan: process.env.ETHERSCAN_API_KEY,
  });
  const signer = wallet.connect(provider);
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];
  const ballotContract: CustomBallot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as CustomBallot;
  return { ballotContract, provider, signer };
};

const vote = async (ballotContract: CustomBallot, signer: ethers.Wallet) => {
  if (process.argv.length < 4) throw new Error("Proposal missing");
  const proposal = process.argv[3];
  if (process.argv.length < 5) throw new Error("Vote amount missing");
  const voteAmount = process.argv[4];

  console.log("Interacting with contract now:");
  const votingPowerBN = await ballotContract.votingPower(signer.address);
  const votingPower = Number(ethers.utils.formatEther(votingPowerBN));
  console.log(`Voter has voting power of: ${votingPower}`);
  if (votingPower <= 0) {
    throw new Error("Voter has no voting power");
  }
  console.log(`Voter vote proposal no. ${proposal}`);
  const tx = await ballotContract.connect(signer).vote(proposal, voteAmount);
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);
};

async function main() {
  const { ballotContract, provider, signer } = attachContract();
  setListeners(ballotContract, provider);
  vote(ballotContract, signer);
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  //   console.log(`Using address ${wallet.address}`);
  //   const provider = ethers.providers.getDefaultProvider("ropsten", {
  //     etherscan: process.env.ETHERSCAN_API_KEY,
  //   });
  //   const signer = wallet.connect(provider);
  //   if (process.argv.length < 3) throw new Error("Ballot address missing");
  //   const ballotAddress = process.argv[2];
  //   if (process.argv.length < 4) throw new Error("Proposal missing");
  //   const proposal = process.argv[3];
  //   if (process.argv.length < 4) throw new Error("Vote amount missing");
  //   const voteAmount = process.argv[4];

  //   const ballotContract: CustomBallot = new Contract(
  //     ballotAddress,
  //     ballotJson.abi,
  //     signer
  //   ) as CustomBallot;

  //   console.log("Interacting with contract now:");
  //   const tx = await ballotContract.connect(wallet).vote(proposal, voteAmount);
  //   await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
