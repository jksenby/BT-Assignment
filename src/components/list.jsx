import { useEffect } from "react";

const { Web3 } = require("web3");
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Address after deployment
const abi = require("../core/abi.json"); // Paste your contract ABI here

const contract = new web3.eth.Contract(abi, contractAddress);

// List a new model
async function listModel(name, description, price, account) {
  await contract.methods
    .listModel(name, description, price)
    .send({ from: account });
}

// Purchase a model
async function purchaseModel(modelId, price, account) {
  await contract.methods
    .purchaseModel(modelId)
    .send({ from: account, value: price });
}

// Rate a model
async function rateModel(modelId, rating, account) {
  await contract.methods.rateModel(modelId, rating).send({ from: account });
}

// Get model details
async function getModelDetails(modelId) {
  return await contract.methods.getModelDetails(modelId).call();
}

// Withdraw funds
async function withdrawFunds(account) {
  await contract.methods.withdrawFunds().send({ from: account });
}

function List() {
  useEffect(() => {
    getModelDetails().then((res) => console.log(res));
  }, []);

  function onListModels(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const modelName = formData.get("modelName");
    const modelDescription = formData.get("modelDescription");
    const modelPrice = formData.get("modelPrice");
    listModel(
      modelName,
      modelDescription,
      modelPrice,
      "0xB6C0F05C9dCF0Ce4fFEC9828e2BddB4FC4330512"
    );
  }

  function onPurchaseModel(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const modelIdToPurchase = formData.get("modelIdToPurchase");
    const modelPrice = formData.get("modelPrice");
    purchaseModel(
      modelIdToPurchase,
      modelPrice,
      "0xB6C0F05C9dCF0Ce4fFEC9828e2BddB4FC4330512"
    );
  }

  function onRateModel(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const purchasedModelId = formData.get("purchasedModelId");
    const modelRating = formData.get("modelRating");
    rateModel(
      purchasedModelId,
      modelRating,
      "0xB6C0F05C9dCF0Ce4fFEC9828e2BddB4FC4330512"
    );
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
            type="number"
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
            type="number"
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
        <button type="button" onClick={() => withdrawFunds()}>
          Withdraw Funds
        </button>
      </section>
    </div>
  );
}

export default List;
