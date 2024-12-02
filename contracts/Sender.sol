// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

//import "IWormholeRelayer.sol" Interface;
import "../IWormholeRelayer.sol";


contract Sender {
    
    //Creating a state variable to interact with WH Relayer Contract
    IWormholeRelayer public wormholeRelayer;
    uint256 constant GAS_LIMIT = 50000;
    
    constructor(address _wormholeRelayer) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
    }

    //Getting a fee cuote for the cost of gas for delivery
    function quoteCrossChainCost(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    //Sending the Message
    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        string memory message
    ) external payable {
        uint256 cost = quoteCrossChainCost(targetChain);

        //Checking that the wallet of the sender has enough money for sending the tx
        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(message, msg.sender),
            0,
            GAS_LIMIT
        );
    }

    
}