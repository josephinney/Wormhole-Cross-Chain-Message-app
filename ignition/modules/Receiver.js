const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Receiver", (m) => {

  const sender = m.contract("Receiver", [], {});

  return { sender };
});