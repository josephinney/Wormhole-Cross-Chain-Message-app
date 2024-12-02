const ethers = require("ethers");

async function sendMessage() {

  if (typeof window.ethereum === "undefined") {
    console.error("Please, install Metamask");
    return;
  }

  const sourceAddress = "0xSenderContractAddress"; // Replace with deployed Sender contract address
  const privateKey = "0xPrivateKey"; // Replace with PK of contract owner

  //Connecting with ETH providers
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/INFURA_PROJECT_ID");
  const wallet = new ethers.Wallet(privateKey, provider);

  const Source = new ethers.Contract(
    sourceAddress,
    ["function sendMessage(bytes message) external"],
    wallet
  );

  const tx = await Source.sendMessage(ethers.utils.toUtf8Bytes("Hello, from Sepolia!"));
  console.log("Message sent! Tx hash:", tx.hash);
}

sendMessage().catch(console.error);

