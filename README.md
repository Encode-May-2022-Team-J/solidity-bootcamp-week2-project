# MyToken contract address (ropsten)

0xb8f22688BEfb8A90D8297AA59d603e75C195Ca13

# CustomBallot contract address (ropsten)

0xecEC91Ff71467DC282D24Cd5c31765F40d048e17

# Terminal output deployToken.ts:

```
yarn run ts-node --files ./scripts/deployToken.ts
Deploying from account address 0xb0754B937bD306fE72264274A61BC03F43FB685F
Wallet balance 0.19980253085194633
Deploying MyToken contract
Awaiting confirmations
Token contract successfully deployed at address: 0xb8f22688BEfb8A90D8297AA59d603e75C195Ca13
Minting some tokens..
Minting 1000000000000000 for 0xD2E0F920E403D8D9F8aA4Ae33Fca95D059F6EA54
Awaiting confirmations
Minted 1000000000000000 to 0xD2E0F920E403D8D9F8aA4Ae33Fca95D059F6EA54
MyToken balance of 0xD2E0F920E403D8D9F8aA4Ae33Fca95D059F6EA54: 1000000000000000
Minting 1000000000000000 for 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
Awaiting confirmations
Minted 1000000000000000 to 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
MyToken balance of 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41: 1000000000000000
Minting 1000000000000000 for 0xB5fFBF67Fb1834dCFB8d3e9DAAEa2E67a6bc70de
Awaiting confirmations
Minted 1000000000000000 to 0xB5fFBF67Fb1834dCFB8d3e9DAAEa2E67a6bc70de
MyToken balance of 0xB5fFBF67Fb1834dCFB8d3e9DAAEa2E67a6bc70de: 1000000000000000
Minting 1000000000000000 for 0xb0754B937bD306fE72264274A61BC03F43FB685F
Awaiting confirmations
Minted 1000000000000000 to 0xb0754B937bD306fE72264274A61BC03F43FB685F
MyToken balance of 0xb0754B937bD306fE72264274A61BC03F43FB685F: 1000000000000000
Delegaing votes to myself..
Awaiting confirmation
Successfully delegated
Done
Done in 258.93s.
```

# Delegate:

delegate.ts script is run to delegate vote. You need provide your private key in `PRIVATE_KEY` in `.env` so that the ballot is connected to your wallet in order to delegate your vote. This script should to be run before deploying ballot so that the voter has the voting power to vote. Run below command.

```
yarn ballot:delegate [token_contract_address] [delegatee_address]
```

Example:

In this example, vote is delegated to self.

```
yarn ballot:delegate 0xb8f22688BEfb8A90D8297AA59d603e75C195Ca13 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
```

Result:

Transaction hash: 0x4b44564fa3b48fcbb00394e39d9a4e44ea9210b6432f7cb5e8f79638d4d04fff

```
14e7de9f1a76cf6c15a7764251695b87349ee3fba1adbc2542168249687b062c
Using address 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
Interacting with contract now:
Give voting power to 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
Transaction completed. Hash: 0x4b44564fa3b48fcbb00394e39d9a4e44ea9210b6432f7cb5e8f79638d4d04fff
```

# Deploy Ballot:

```
yarn run ts-node --files ./scripts/deployBallot.ts "Proposal 1" "Proposal 2" "Proposal 3"
Deploying from account address 0xb0754B937bD306fE72264274A61BC03F43FB685F
Wallet balance 0.19054234379670842
Deploying ballot contract with:
Ballot proposals: Proposal 1,Proposal 2,Proposal 3
Vote token address 0xb8f22688BEfb8A90D8297AA59d603e75C195Ca13
Awaiting confirmations
CustomBallot contract successfully deployed at address: 0xecEC91Ff71467DC282D24Cd5c31765F40d048e17 - ready to receive votes
Done in 34.79s.
```

# Cast Vote:

castVote.ts is used for voter to cast vote. You need provide your private key in `PRIVATE_KEY` in `.env` so that the ballot is connected to your wallet in order to cast your vote. Run below command to cast vote to selected proposal:

```
yarn ballot:vote [ballot_contract_address] [proposal] [vote_amount]
```

Example:

In this example, ballot with address 0xecEC91Ff71467DC282D24Cd5c31765F40d048e17 is used for casting vote. First proposal is casted with vote amount of 30000000000

```
yarn ballot:vote 0xecEC91Ff71467DC282D24Cd5c31765F40d048e17 1 30000000000
```

Result:

Transaction hash: 0x35718b4f808a5baabf3f59d664f00ef736e06b76ad6a0def0abcf95a82a9ff7e

```
Using address 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41
Interacting with contract now:
Voter has voting power of: 0.00099979
Voter vote proposal no. 1
Transaction completed. Hash: 0x35718b4f808a5baabf3f59d664f00ef736e06b76ad6a0def0abcf95a82a9ff7e
Voted event: 0x886A072C21f6d35F8498546c7Bd6234B7fad7e41 voted for Proposal 2 with amount 0.00000003
```
