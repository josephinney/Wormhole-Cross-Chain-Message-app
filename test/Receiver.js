const { expect } = require("chai")
const { ethers } =  require("hardhat")
const { AbiCoder } = require("ethers")
const abiCoder = new AbiCoder()

describe("Receiver", () => {
   
    let owner, nonOwner
    const sourceChain = 10000 //Simulate chain ID Sepolia;
    const sourceAddress = "0x736f757263652061646472657373000000000000000000000000000000000000"; //Simulate address from Sepolia
    const message = "Hello from Sepolia?"; //Random incoming message from Sepolia
    const deliveryHash = "0x5748809fa3b2039b41f9688b88fe240bfd5ccec641a3bc2c047cdaba58b8c3dd"//Random hash
    const payload = "0x48656c6c6f2066726f6d205365706f6c69613f" //Payload de "Hello from Sepolia?"

    beforeEach( async () => {
        
        [owner, nonOwner] = await ethers.getSigners()

        // Deploying the mock for IWormholeRelayer
        const WormholeRelayerMock = await ethers.getContractFactory("WormholeRelayerMock")
        this.wormholeRelayerMock = await WormholeRelayerMock.deploy()

        // Deploying Receiver contract
        const Receiver = await ethers.getContractFactory("Receiver")
        this.receiver = await Receiver.deploy(this.wormholeRelayerMock.target)
        
    })

    it("Contract Receiver deployed succesfully", async () => {
        const registrationOwner = await this.receiver.registrationOwner()
    
        expect(registrationOwner).to.equal(owner.address);
    })

    it("Should allow the owner to register a sender", async () => {

        //Register a new allowed sender
        await this.receiver.setRegisteredSender(sourceChain, sourceAddress)

        //Putting the address of the allowed sender from the mapping
        const sender = await this.receiver.registeredSender(sourceChain)
        
        //Comparing that the address in the mapping is equal to sourceAddress
        expect(sender).to.be.equal(sourceAddress)

    })


    it("Should not allow a non-owner to register a sender", async () => {
        await expect(
            this.receiver.connect(nonOwner).setRegisteredSender(sourceChain, sourceAddress)
        ).to.be.revertedWith("Only the owner can register a sender")
    })

    
    it("Should revert if the function is not called by the Wormhole Relayer contract", async () => {
      
        // Register sender
        await this.receiver.setRegisteredSender(sourceChain, sourceAddress);

        // The function should revert because is being called by the Receiver contract
        await expect(
            this.receiver.connect(owner).receiveWormholeMessages(
              payload,
              [], 
              sourceAddress,
              sourceChain,
              deliveryHash
            )
          ).to.be.revertedWith("Only the Wormhole relayer contract can call this function");

    })

    it("Should revert if the sender is not registered", async () => {
        
        // The function should revert because we didn't register a sender previously
        await expect(
            this.receiver.connect(owner).receiveWormholeMessages(
              payload,
              [], 
              sourceAddress,
              sourceChain,
              deliveryHash
            )
          ).to.be.revertedWith("No registered sender. We can not process its message");
    })



    //Should emit MessageReceived event when a valid message is received from a registered sender
    it("Should emit MessageReceived event when a valid message is received from a registered sender", async () => {

        // Register sender
        await this.receiver.setRegisteredSender(sourceChain, sourceAddress);

      
        // Calling receiveWormholeMessages function with wormholeRelayerMock contract
       const tx = await this.wormholeRelayerMock.connect(owner).receiveWormholeMessages(
            payload,
            [], 
            sourceAddress,
            sourceChain,
            deliveryHash
          )
        
        await expect(tx).to.emit(this.wormholeRelayerMock, "MessageReceived").withArgs(message);
        
})








})