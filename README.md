# Wormhole Cross-Chain Messaging
This project demonstrates cross-chain message passing using Wormhole between Ethereum Sepolia Testnet and Ethereum Holesky Testnet.

# Ensure you have the following:

Node.js and npm installed on your machine
Hardhat for deploying contracts
Testnet tokens for Sepolia Testnet and Holesky Testnet to cover gas fees
Wallet private key

## Steps
1. Deploy Source contract on Ethereum.
2. Deploy Target contract on BSC.
3. Send a message using Wormhole. (Run the script sendMessage)
4. Verify the VAA on WormholeScan.

## Commands
- `npx hardhat ignition deploy ./ignition/modules/Sender.js --network sepolia`
- `npx hardhat ignition deploy ./ignition/modules/Receiver.js --network holesky`

