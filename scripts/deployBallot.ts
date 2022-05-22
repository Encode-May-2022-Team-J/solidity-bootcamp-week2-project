import { ethers } from "ethers";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";
import dotenv from "dotenv";
dotenv.config()

const PROPOSALS = process.argv.slice(2);

const VOTE_TOKEN_ADDRESS = '0xb8f22688BEfb8A90D8297AA59d603e75C195Ca13'

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];

    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }

    return bytes32Array;
};

async function main() {

    if (PROPOSALS.length < 2) throw new Error('Please specify at least two proposals')

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '');

    console.log(`Deploying from account address ${wallet.address}`);

    const provider = ethers.providers.getDefaultProvider("ropsten");

    const signer = wallet.connect(provider);

    const balanceBN = await signer.getBalance();

    const balance = Number(ethers.utils.formatEther(balanceBN));

    console.log(`Wallet balance ${balance}`);

    if (balance < 0.02) {
        throw new Error("Not enough ether");

    }

    const ballotFactory = new ethers.ContractFactory(
        ballotJson.abi,
        ballotJson.bytecode,
        signer
    );
    
    console.log('Deploying ballot contract with:');
    
    console.log(`Ballot proposals: ${PROPOSALS}`);
    
    console.log(`Vote token address ${VOTE_TOKEN_ADDRESS}`);
    
    const ballotContract = await ballotFactory.deploy(convertStringArrayToBytes32(PROPOSALS), VOTE_TOKEN_ADDRESS) as CustomBallot;
    
    console.log("Awaiting confirmations");
    
    await ballotContract.deployed();
    
    await ballotContract.deployTransaction.wait(2);
    
    console.log(`CustomBallot contract successfully deployed at address: ${ballotContract.address} - ready to receive votes`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
