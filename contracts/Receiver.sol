// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../IWormholeRelayer.sol";
import "../IWormholeReceiver.sol";

contract Receiver is IWormholeReceiver {

    //State variable to interact with the WH Relayer contract
    IWormholeRelayer public wormholeRelayer;
    address public registrationOwner;

    //Mapping that stores the address of the registered sender contracts
    mapping (uint16 => bytes32) public registeredSender;

    //Declaring the event that will log the content of the message that was processed by the contract
    event MessageReceived(string message);
    //Declaring the event that will log the source chain ID
    event SourceChainLogged(uint16 sourceChain);

    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        //Set contract deployer as the owner
        registrationOwner = msg.sender;
    }

    //Modifier that restricts the processing of msg only to those coming from registered senders
    modifier isRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) {
        require(
            registeredSender[sourceChain] == sourceAddress,
            "No registered sender. We can not process its message"
        );
        
        _;
    }

    //Function used to register a sender address for a specific source chain
    function setRegisteredSender(uint16 sourceChain, bytes32 sourceAddress) public {

        require(msg.sender == registrationOwner, 
        "Only the owner can register a sender");

        registeredSender[sourceChain] = sourceAddress;
    }
    
    //Core function that process the received message:
    function receiveWormholeMessages(
        bytes memory payload, 
        bytes[] memory additionalMessages,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32 deliveryHash
    ) public payable override isRegisteredSender (sourceChain, sourceAddress)  {

    //Requiring that only Wormhole Relayer can decode the message
    require(
        msg.sender == address(wormholeRelayer),
        "Only the Wormhole relayer contract can call this function"
    );

    //Decoding the payload to get the message
    string memory message = abi.decode(payload, (string));

    //Emiting the event SourceChainLogged
    if(sourceChain != 0) {
        emit SourceChainLogged(sourceChain);
    }

    //Emitting the decoded message
    emit MessageReceived(message);
    
    }
    





    
}
