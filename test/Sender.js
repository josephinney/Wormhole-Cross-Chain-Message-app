const { expect } = require("chai");
const { ethers } = require("hardhat");
const { AbiCoder } = require("ethers");
const abiCoder = new AbiCoder();

describe("Sender", () => {

    let owner;

    const GAS_LIMIT = 50000;
    const TARGET_CHAIN = 5; //Simulate Holesky Chain ID 
    const TARGET_ADDRESS = "0x0000000000000000000000000000000000000001" //Simulates address in Holesky
    const MESSAGE = "Hello from Sepolia!";

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        //We deploy the Mock for IWormholeRelayer
        const WormholeRelayerMock = await ethers.getContractFactory("WormholeRelayerMock");
        this.wormholeRelayerMock = await WormholeRelayerMock.deploy();
        
        //We deploy Sender passing as argument the address of WormholeRelayerMock
        const Sender = await ethers.getContractFactory("Sender");
        this.sender = await Sender.deploy(this.wormholeRelayerMock.target);
        
    });

    it("Should deploy successfully", async () => {
        const address = this.sender.target;

        expect(address).to.not.be.null;
        expect(address).to.not.equal("0x0");
        expect(address).to.not.be.undefined;
        expect(address).to.not.be.empty;
    });

    it("Should return a quote for cross-chain cost", async () => {
        // We call quoteCrossChainCost from Sender contract to obtain the cost
        const cost = await this.sender.quoteCrossChainCost(TARGET_CHAIN);

        expect(cost).to.equal(250000);
    });

    // We try to send with not enough funds
    it("Should revert when funds are insufficient for cross-chain delivery", async () => {
        const cost = await this.sender.quoteCrossChainCost(TARGET_CHAIN);
    
        await expect(
          this.sender.connect(owner).sendMessage(TARGET_CHAIN, TARGET_ADDRESS, MESSAGE, {
            value: 240000, //We send less than the necessary cost 250000
          })
        ).to.be.revertedWith("Insufficient funds for cross-chain delivery");
    });

    it("Should send a message succesfully with enough funds", async () => {
    //Getting the cost
    const cost = await this.sender.quoteCrossChainCost(TARGET_CHAIN);


    //Simulating making the Tx with enough funds
    await expect(
        this.sender.connect(owner).sendMessage(TARGET_CHAIN, TARGET_ADDRESS, MESSAGE, {
          value: cost,
        })
      ).to.emit(this.wormholeRelayerMock, "PayloadSent")
        .withArgs(
          TARGET_CHAIN,
          TARGET_ADDRESS,
          abiCoder.encode(["string", "address"], [MESSAGE, owner.address]),
          0,
          GAS_LIMIT
        );
        
    })


    // Simulating a correct interaction with the WormholeRelayer
    it("Should interact with WormholeRelayer correctly", async () => {
        const cost = await this.sender.quoteCrossChainCost(TARGET_CHAIN);
    
        //We spy the call of sendPayloadToEvm of WormholeRelayerMock
        await this.sender.connect(owner).sendMessage(TARGET_CHAIN, TARGET_ADDRESS, MESSAGE, {
          value: cost,
        });
    
        const lastPayload = await this.wormholeRelayerMock.getLastPayload();
    
        //We decode the payload to check that is correct
        const decodedPayload = abiCoder.decode(
          ["string", "address"],
          lastPayload.payload
        );
    
        expect(decodedPayload[0]).to.equal(MESSAGE);
        expect(decodedPayload[1]).to.equal(owner.address);
      });

  




});