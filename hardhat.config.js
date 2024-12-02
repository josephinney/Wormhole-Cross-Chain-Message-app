require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config(); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
     // accounts: [process.env.PRIVATE_KEY_SEPOLIA],
    },
    holesky: {
      url: `https://holesky.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, 
     // accounts: [process.env.PRIVATE_KEY_SEPOLIA],
    },
    ganacheChain1: {
      url: "http://127.0.0.1:7545",
      accounts: ["0x5665ac22d9c8a015624929edd46dce84d08918b190d423c45d0596d452aa3499"], 
    },
    ganacheChain2: {
      url: "http://127.0.0.1:8545", 
      accounts: ["0x74f54ecb7bbc976996b6ee1f582316c17ef49b4f74394a3a6d3f0cb44fe5fc09"],
    },
  },
};