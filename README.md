# MyToken contract address (ropsten)

0x48DFC913ca94d08DC7edbf71266208E36d666f1d

# CustomBallot contract address (ropsten)

0x6648CA1fc9EF5eDCbC9A11450E54f8668Bd9565d

# Terminal output:

yarn run ts-node --files ./scripts/deploy.ts
Deploying from account address 0xb0754B937bD306fE72264274A61BC03F43FB685F
Wallet balance 0.21409205443697013
Deploying MyToken contract
Awaiting confirmations
Token contract successfully deployed at address: 0x48DFC913ca94d08DC7edbf71266208E36d666f1d
Minting some tokens for myself..
Awaiting confirmations
Minted 1000000000000000
MyToken balance of my wallet: 1000000000000000
Delegaing votes to myself..
Awaiting confirmation
Successfully delegated
Deploying ballot contract with:
Ballot proposals: Yes,No,YesAndNo
Vote token address 0x48DFC913ca94d08DC7edbf71266208E36d666f1d
Awaiting confirmations
CustomBallot contract successfully deployed at address: 0x6648CA1fc9EF5eDCbC9A11450E54f8668Bd9565d
Check my voting power
Current voting power: 1000000000000000
Putting a vote in.. 99999 MTK on Yes
Awaiting confirmation
Successfully voted
Spent voting power: 99999
Remaining voting power: 999999999900001
Current leading proposal is 0x5965730000000000000000000000000000000000000000000000000000000000
Changed my mind, putting another vote in.. 999999 MTK on No
Awaiting confirmation
Successfully voted
Spent voting power: 1099998
Remaining voting power: 999999998900002
Current leading proposal is 0x4e6f000000000000000000000000000000000000000000000000000000000000
I guess what I really meant was Yes and No.. 9999999 MTK on YesAndNo
Awaiting confirmation
Successfully voted
Spent voting power: 11099997
Remaining voting power: 999999988900003
Current leading proposal is 0x4e6f000000000000000000000000000000000000000000000000000000000000
Done
Done in 325.54s.
