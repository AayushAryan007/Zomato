const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded. Use field 'video'." });
    }
    const upload = await storageService.uploadFile(
      req.file.buffer,
      `food-${uuidv4()}`
    );

    const { name, description } = req.body;
    const food = await foodModel.create({
      name,
      description,
      video: upload.url, // save video URL
      foodPartner: req.foodPartner._id, // link to partner
    });

    return res.status(201).json({ message: "Food created", food });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems,
  });
}

module.exports = {
  createFood,
  getFoodItems,
};
