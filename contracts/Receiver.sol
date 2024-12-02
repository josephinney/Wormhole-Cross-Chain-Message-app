// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Receiver {
    string public receivedMessage;

    function receiveMessage(bytes memory message) external {
        receivedMessage = string(message);
    }
}
