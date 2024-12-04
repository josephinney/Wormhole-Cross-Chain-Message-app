// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


/*

    THIS IS A MOCK OF THE WOMHOLE RELAYER CONTRACT FOR TESTING PURPOSES

*/

contract WormholeRelayerMock {
    struct Payload {
        uint16 targetChain;
        address targetAddress;
        bytes payload;
        uint256 nonce;
        uint256 gasLimit; 
    }

    Payload public lastPayload;
    uint64 public sequence = 1;

    event PayloadSent(
        uint16 indexed targetChain,
        address indexed targetAddress,
        bytes payload,
        uint256 nonce,
        uint256 gasLimit
    );

    event MessageReceived(string message);

    //Simulate the behavior of quoteEVMDeliveryPrice
    function quoteEVMDeliveryPrice(
        uint16 targetChain,
        uint256,
        uint256 gasLimit
    ) public pure returns (uint256 cost, uint256) {
        cost = targetChain * gasLimit; // Example of cost calculation
        return (cost, 0); 
    }

    //Simulate the behavior of sendPayloadToEvm
    function sendPayloadToEvm(
        uint16 targetChain,
        address targetAddress,
        bytes calldata payload,
        uint256 nonce,
        uint256 gasLimit
    ) external payable returns (uint64 sequenceNumber) {
        lastPayload = Payload(targetChain, targetAddress, payload, nonce, gasLimit);
        emit PayloadSent(targetChain, targetAddress, payload, nonce, gasLimit);

        uint64 currentSequence = sequence; 
        sequence++; 
        return currentSequence; 
    }

    //Function receiveWormholeMessages
    function receiveWormholeMessages(
        bytes memory payload, 
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) public {

        emit MessageReceived(string(payload));
    }

    function getLastPayload() external view returns (Payload memory) {
        return lastPayload;
    }
}
