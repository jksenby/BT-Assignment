import { useEffect, useState } from "react";

const { Web3 } = require("web3");
let web3;
const contractAddress = "0xB3405E587845438c44841840Fe1cB0F60d1D8c11";
let abi = require("../core/abi.json");
const account = "0xC74217Af539c7df747BC7D583ec9cA06110e4749";

let contract;

async function listModel(account, name, description, price) {
  try {
    await contract.methods
      .listModel(name, description, price)
      .send({ from: account });
    console.log(`Model listed successfully!`);
  } catch (error) {
    console.error(`Error listing model:`, error);
  }
}

async function purchaseModel(account, modelId, value) {
  try {
    await contract.methods
      .purchaseModel(modelId)
      .send({ from: account, value: web3.utils.toWei(value, "ether") });
    console.log(`Model purchased successfully!`);
  } catch (error) {
    console.error(`Error purchasing model:`, error);
  }
}

async function rateModel(account, modelId, rating) {
  try {
    await contract.methods.rateModel(modelId, rating).send({ from: account });
    console.log(`Model rated successfully!`);
  } catch (error) {
    console.error(`Error rating model:`, error);
  }
}

async function withdrawFunds(account) {
  try {
    await contract.methods.withdrawFunds().send({ from: account });
    console.log(`Funds withdrawn successfully!`);
  } catch (error) {
    console.error(`Error withdrawing funds:`, error);
  }
}

function List() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchABI();
  }, []);

  async function fetchABI() {
    initializeContract();
  }

  async function initializeContract() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // Инициализация web3 с провайдером MetaMask
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // Запрос доступа к учетным записям
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      console.error("MetaMask is not installed. Please install MetaMask.");
      return;
    }

    contract = new web3.eth.Contract(abi, contractAddress);

    getModels();
  }

  async function getModels() {
    const modelCount = await contract.methods.modelCount().call();

    for (let i = 0; i < modelCount; i++) {
      const modelDetails = await contract.methods.getModelDetails(i).call();
      setModels([
        ...models,
        <div key={Math.random()}>
          <strong>ID: {i}</strong>
          <p>
            <strong>Name:</strong> {modelDetails[0]}
          </p>
          <p>
            <strong>Description:</strong> {modelDetails[1]}
          </p>
          <p>
            <strong>Price:</strong>
            {web3.utils.fromWei(modelDetails[2], "ether")} ETH
          </p>
          <p>
            <strong>Creator:</strong> {modelDetails[3]}
          </p>
          <p>
            <strong>Average Rating:</strong> {modelDetails[4] + ""}
          </p>
          <p>-------------------------------</p>
        </div>,
      ]);
    }
  }

  function onListModels(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const modelName = formData.get("modelName");
    const modelDescription = formData.get("modelDescription");
    const modelPrice = formData.get("modelPrice");
    const priceInWei = web3.utils.toWei(modelPrice, "ether");
    listModel(account, modelName, modelDescription, priceInWei).then(() =>
      getModels()
    );
  }

  function onPurchaseModel(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const modelIdToPurchase = formData.get("modelIdToPurchase");
    const modelPrice = formData.get("modelPrice");
    purchaseModel(account, modelIdToPurchase, modelPrice).then(() =>
      getModels()
    );
  }

  function onRateModel(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const purchasedModelId = formData.get("purchasedModelId");
    const modelRating = formData.get("modelRating");
    rateModel(account, purchasedModelId, modelRating).then(() => getModels());
  }

  return (
    <div>
      <h1>AI Model Marketplace</h1>
      <section>
        <h2>List a New AI Model</h2>
        <form onSubmit={onListModels}>
          <label htmlFor="modelName">Model Name</label>
          <input
            type="text"
            name="modelName"
            placeholder="Enter model name"
            required
          />

          <label htmlFor="modelDescription">Model Description</label>
          <input
            type="text"
            name="modelDescription"
            placeholder="Enter model description"
            required
          />

          <label htmlFor="modelPrice">Model Price (in Wei)</label>
          <input
            type="text"
            inputMode="decimal"
            name="modelPrice"
            placeholder="Enter price in Wei"
            required
          />

          <button type="submit">List Model</button>
        </form>
      </section>

      <section>
        <h2>Available Models</h2>
        <div id="availableModels"></div>
        {models}
      </section>

      <section>
        <h2>Purchase a Model</h2>
        <form onSubmit={onPurchaseModel}>
          <label htmlFor="modelIdToPurchase">Model ID to Purchase</label>
          <input
            type="text"
            name="modelIdToPurchase"
            placeholder="Enter model ID"
            required
          />

          <label htmlFor="modelPrice">Model Price</label>
          <input
            type="text"
            inputMode="decimal"
            name="modelPrice"
            placeholder="Enter model price"
            required
          />

          <button type="submit">Purchase Model</button>
        </form>
      </section>

      <section>
        <h2>Rate a Purchased Model</h2>
        <form onSubmit={onRateModel}>
          <label htmlFor="purchasedModelId">Purchased Model ID</label>
          <input
            type="text"
            name="purchasedModelId"
            placeholder="Enter purchased model ID"
            required
          />

          <label htmlFor="modelRating">Rating (1-5)</label>
          <input
            type="number"
            name="modelRating"
            placeholder="Enter rating"
            min="1"
            max="5"
            required
          />

          <button type="submit">Rate Model</button>
        </form>
      </section>

      <section>
        <h2>Withdraw Funds</h2>
        <button type="button" onClick={() => withdrawFunds(account)}>
          Withdraw Funds
        </button>
      </section>
    </div>
  );
}

export default List;
