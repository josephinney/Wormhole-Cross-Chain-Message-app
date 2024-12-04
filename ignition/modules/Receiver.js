const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Receiver", (m) => {

  //Wormhole contract address on the target Chain (Ethereum Holesky)
  //url: https://wormhole.com/docs/build/reference/contract-addresses/#__tabbed_1_2
  const wormholeAddress = "0xa10f2eF61dE1f19f586ab8B6F2EbA89bACE63F7a";

  //Defines de deployment receiver and pass the Wormhole contract address as the only constructor parameter
  const receiver = m.contract("Receiver", [wormholeAddress]);

  //Return the deployed contract
  return {receiver};


});