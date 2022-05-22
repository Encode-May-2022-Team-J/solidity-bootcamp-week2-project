import { Contract, ethers } from "ethers";
// eslint-disable-next-line node/no-missing-import
import { MyToken } from "../typechain";
import * as MyTokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import "dotenv/config";

const attachContract = () => {
  console.log(process.env.PRIVATE_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten", {
    etherscan: process.env.ETHERSCAN_API_KEY,
  });
  const signer = wallet.connect(provider);
  if (process.argv.length < 3) throw new Error("Token address missing");
  const tokenAddress = process.argv[2];
  const tokenContract: MyToken = new Contract(
    tokenAddress,
    MyTokenJson.abi,
    signer
  ) as MyToken;
  return { tokenContract, provider, signer };
};

const delegate = async (tokenContract: MyToken) => {
  if (process.argv.length < 4) throw new Error("Delegatee missing");
  const delegatee = process.argv[3];
  console.log("Interacting with contract now:");
  console.log(`Give voting power to ${delegatee}`);
  const tx = await tokenContract.delegate(delegatee);
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);
};

async function main() {
  const { tokenContract } = attachContract();
  delegate(tokenContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
