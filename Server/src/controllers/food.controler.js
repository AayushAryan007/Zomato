const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");
async function createFood(req, res) {
  res.send("Create Food Endpoint");
  // console.log(req.body);
  // console.log(req.file);
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuidv4()
  );
  console.log(fileUploadResult);
}

module.exports = {
  createFood,
};
