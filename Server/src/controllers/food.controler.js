const foodModel = require("../models/food.model");

async function createFood(req, res) {
  res.send("Create Food Endpoint");
  // console.log(req.body);
  // console.log(req.file);
}

module.exports = {
  createFood,
};
