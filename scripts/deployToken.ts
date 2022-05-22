// yarn run ts-node --files ./scripts/deploy.ts "arg1" "arg2" "arg3

import { ethers } from "ethers";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";
import dotenv from "dotenv";
dotenv.config()

const TOKEN_AMOUNT = 1000000000000000;

const MINT_RECEIPIENTS = [
    '0xD2E0F920E403D8D9F8aA4Ae33Fca95D059F6EA54', 
    '0x886A072C21f6d35F8498546c7Bd6234B7fad7e41', 
    '0xB5fFBF67Fb1834dCFB8d3e9DAAEa2E67a6bc70de',
    '0xb0754B937bD306fE72264274A61BC03F43FB685F',
];

const delegate = async(tokenContract: ethers.Contract, delegatee: string) => {
    const tx = await tokenContract.delegate(delegatee);
    console.log('Awaiting confirmation');
    await tx.wait();
    console.log('Successfully delegated');
}

const mintAndCheckBalance = async (provider: ethers.providers.BaseProvider, tokenContract: MyToken, receiverAddress: string, amount: number) => {
    console.log(`Minting ${TOKEN_AMOUNT} for ${receiverAddress}`);
    const mintTx = await tokenContract.mint(receiverAddress, amount);
    console.log("Awaiting confirmations");
    await mintTx.wait();
    console.log(`Minted ${TOKEN_AMOUNT} to ${receiverAddress}` );
    const tempContract = new ethers.Contract(
        tokenContract.address,
        tokenJson.abi,
    );
    const connectedToken = tempContract.connect(provider);
    const tokenBalanceBN = await connectedToken.balanceOf(receiverAddress);
    console.log(`MyToken balance of ${receiverAddress}: ${tokenBalanceBN.toString()}`);
}

async function main() {

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

    const tokenFactory = new ethers.ContractFactory(
        tokenJson.abi,
        tokenJson.bytecode,
        signer
    );

    console.log("Deploying MyToken contract");

    const tokenContract = await tokenFactory.deploy() as MyToken;

    console.log("Awaiting confirmations");

    await tokenContract.deployed();

    console.log(`Token contract successfully deployed at address: ${tokenContract.address}`);

    console.log('Minting some tokens..');

    for (const address of MINT_RECEIPIENTS) {
        await mintAndCheckBalance(provider, tokenContract, address, TOKEN_AMOUNT);
    }
    
    console.log('Delegaing votes to myself..');

    await delegate(tokenContract, wallet.address);

    console.log('Done');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});