const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");
const likesModel = require("../models/likes.model");
const savesModel = require("../models/save.model");
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

async function likeFood(req, res) {
  const { foodId } = req.body;

  const { user } = req;

  const isAlreadyLiked = await likesModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likesModel.deleteOne({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { likeCount: -1 },
    });
    return res.status(200).json({ message: "Food unliked successfully" });
  }

  const like = await likesModel.create({
    user: user._id,
    food: foodId,
  });
  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { likeCount: 1 },
  });
  res.status(201).json({ message: "Food liked successfully", like });
}

async function saveFood(req, res) {
  const { foodId } = req.body;

  const { user } = req;
  const isAlreadySaved = await savesModel.findOne({
    user: user._id,
    food: foodId,
  });
  if (isAlreadySaved) {
    await savesModel.deleteOne({ user: user._id, food: foodId });
    return res.status(200).json({ message: "Food unsaved successfully" });
  }
  const save = await savesModel.create({
    user: user._id,
    food: foodId,
  });
  res.status(201).json({ message: "Food saved successfully", save });
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
};
