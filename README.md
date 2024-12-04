# Wormhole Cross-Chain Messaging
This project demonstrates cross-chain message passing using Wormhole between Ethereum Sepolia Testnet and Ethereum Holesky Testnet.

# Ensure you have the following:

- Node.js and npm installed on your machine
- Hardhat for deploying contracts
- Testnet tokens for Sepolia Testnet and Holesky Testnet to cover gas fees
- Wallet Private Key

## Commands
- `npx hardhat ignition deploy ./ignition/modules/Sender.js --network sepolia`
- `npx hardhat ignition deploy ./ignition/modules/Receiver.js --network holesky`

## Brief resume about what the contracts do

 SENDER CONTRACT:

 1. When the contract is deployed, the `wormholeRelayer` is set.

 2. The function `quoteCrossChainCost` calculates the cost of sending a message to a specific destination chain using the Wormhole Relayer contract
 `wormholeRelayer.quoteEVMDeliveryPrice`.
 
 3. Sends the message using the function `sendMessage`:
      
      3.1 Verifies that the funds sent `(msg.value)` are enough to cover the `cost`.

      3.2 Sends the message to the destination contract on the destination chain using the Wormhole Relayer contract
      `wormholeRelayer.sendPayloadToEvm`.

 RECEIVER CONTRACT:

 1. When deploying the contract, the `wormholeRelayer` and `registrationOwner` are set.

 2. The function `setRegisteredSender` allows ONLY the contract owner to register addresses of authorized sender contracts to send messages.

 3. The function `receiveWormholeMessages`receives and decode the message. For that:

   3.1 It verifies that the message comes from the `wormholeRelayer`, meaning that only the `wormholeRelayer` can call this function.

   3.2 It uses the `isRegisteredSender` modifier to ensure the sender of the msg is registered and can send msg to the Receiver contract.

   3.3 It decodes the payload to extract the message.

   3.4 Emits a `MessageReceived` event with the content of the message.

# TESTS IMPLEMENTED

RECEIVER CONTRACT
- Contract Receiver deployed succesfully
- Should allow the owner to register a sender
- Should not allow a non-owner to register a sender
- Should revert if the function (receiveWormholeMessages) is not called by the Wormhole Relayer contract
- Should revert if the sender is not registered
- Should emit MessageReceived event when a valid message is received from a registered sender

SENDER CONTRACT
- Should deploy successfully
- Should return a quote for cross-chain cost
- Should revert when funds are insufficient for cross-chain delivery
- Should send a message succesfully with enough funds
- Should interact with WormholeRelayer correctly



