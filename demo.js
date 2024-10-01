const { Web3 } = require("web3");

const web3 = new Web3("https://mainnet.infura.io/v3/");

await web3.eth.getBalance("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
