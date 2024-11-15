//index.js
const { Web3 } = require("web3");
const endpointUrl =
  "https://virtual.gnosis.rpc.tenderly.co/0c3b0199-9937-4d66-b804-0b27b0a22ced";
const httpProvider = new Web3.providers.HttpProvider(endpointUrl);
const web3Client = new Web3(httpProvider);

const minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const tokenAddress = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";
const walletAddress = "0x24d23Bfe31341a438bF187c7689A1C7C7Cc36088";

const contract = new web3Client.eth.Contract(minABI, tokenAddress);

async function getBalance() {
  const result = await contract.methods.balanceOf(walletAddress).call();

  const resultInEther = web3Client.utils.fromWei(result, "ether");

  console.log(`Balance in wei: ${result}`);

  console.log(`Balance in ether: ${resultInEther}`);
}

getBalance();

