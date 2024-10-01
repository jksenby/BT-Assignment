    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 ratingSum;
        uint256 ratingCount;
    }

    mapping(uint256 => Model) public models;
    uint256 public modelCount = 0;
    mapping(uint256 => mapping(address => bool)) public purchased;

    // List a new AI Model
    function listModel(string memory _name, string memory _description, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        modelCount++;
        models[modelCount] = Model(_name, _description, _price, payable(msg.sender), 0, 0);
    }

    // Purchase an AI Model
    function purchaseModel(uint256 _modelId) public payable {
        Model storage model = models[_modelId];
        require(_modelId > 0 && _modelId <= modelCount, "Model does not exist");
        require(msg.value >= model.price, "Not enough Ether sent");
        require(!purchased[_modelId][msg.sender], "Model already purchased");

        // Transfer the funds to the model creator
        model.creator.transfer(msg.value);
        purchased[_modelId][msg.sender] = true;
    }

    // Rate a purchased AI Model
    function rateModel(uint256 _modelId, uint8 _rating) public {
        require(purchased[_modelId][msg.sender], "You have not purchased this model");
        require(_rating > 0 && _rating <= 5, "Rating should be between 1 and 5");

        Model storage model = models[_modelId];
        model.ratingSum += _rating;
        model.ratingCount++;
    }

    // Withdraw funds (contract owner)
    function withdrawFunds() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Get details of a model
    function getModelDetails(uint256 _modelId) public view returns (string memory, string memory, uint256, address, uint256) {
        Model storage model = models[_modelId];
        uint256 avgRating = model.ratingCount > 0 ? model.ratingSum / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, avgRating);
    }
}