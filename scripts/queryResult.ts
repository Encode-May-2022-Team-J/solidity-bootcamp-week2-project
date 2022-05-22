import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
// eslint-disable-next-line node/no-missing-import
import { CustomBallot } from "../typechain";

async function main() {
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

  let index = 0;
  while (true) {
    try {
      const proposal = await ballotContract.proposals(index);
      console.log(
        `${ethers.utils.parseBytes32String(
          proposal.name
        )}: ${proposal.voteCount.toNumber()}`
      );
      index++;
    } catch (err) {
      break;
    }
  }

  const winningProposal = await ballotContract.winningProposal();
  console.log(`Winning proposal index: ${winningProposal.toNumber()}`);

  const winnerName = await ballotContract.winnerName();
  console.log(`Winning Name: ${ethers.utils.parseBytes32String(winnerName)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
