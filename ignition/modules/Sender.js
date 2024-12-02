const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Sender", (m) => {
  //Wormhole contract address on Sepolia 
  // url: https://wormhole.com/docs/build/reference/contract-addresses/#__tabbed_1_2
  const wormholeAddress = "0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78"; 

  //Defines the deployment of the Sender contract and pass the wormholeAddress as argument
  const sender = m.contract("Sender", [wormholeAddress]);

  //Return the deployed contract
  return { sender };
});
