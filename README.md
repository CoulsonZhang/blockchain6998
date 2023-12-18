# blockchain6998 Final Project

## Instructions
Contract Guard offers the user the document sign system within the web3 environment. There are instructions for the offered functionality:

#### Add contract
1. Enter the address & name of user1 and user2 with the credit related to the contract. The higher credit means a higher transaction fee and a thicker line in the contract visualization graph. 

2. Upload the contract file you want to sign & store it in the smart contract

3. Click the "Add Contract" button and note down the given ID after submission

#### Verify contract
1. Enter the contract ID and upload the contract you want to verify

2. Click the "Verify Contract" button. A prompt will tell you whether there is a record for the corresponding ID & contract content.

#### Revise contract
1. Enter the contract ID you want to revise and upload the contract you want to revise

2. Select "My account" for one of the users who signed the contract.

3. Click the button "Revise Contract" to submit the contract updates

## Visualization
The signed contract will be presented with a force-directed graph implemented by js with a fish-eye effect. Each node within the graph presents a user who has signed a contract using Contract Guard. Each line within the graph presents a contract signed between two users. The higher the credit given to the contract, the thicker line the corresponding line would be.

## Deployment link
contractAddress = '0x2C6cb30391F4f5F69Ab9268Ef5B2A11Aa7318AD7'

## Test
Sanity check implemented within script.js and will run automatically.


## Team
Coulson Zhang   |  zz2980

Lei Xu          |  lx2301

Weiran Wang    |  ww2584