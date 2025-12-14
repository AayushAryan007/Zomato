const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");
const likesModel = require("../models/likes.model");
const savesModel = require("../models/save.model");
const commentModel = require("../models/comment.model");
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
  try {
    const foods = await foodModel.find({}).lean();
    const ids = foods.map((f) => f._id);
    const counts = await commentModel.aggregate([
      { $match: { food: { $in: ids } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    const withCounts = foods.map((f) => ({
      ...f,
      commentsCount: map.get(String(f._id)) || 0,
    }));
    return res
      .status(200)
      .json({
        message: "Food items fetched successfully",
        foodItems: withCounts,
      });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
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
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { savesCount: -1 },
    });
    return res.status(200).json({ message: "Food unsaved successfully" });
  }
  const save = await savesModel.create({
    user: user._id,
    food: foodId,
  });
  await foodModel.findByIdAndUpdate(foodId, {
    $inc: { savesCount: 1 },
  });
  res.status(201).json({ message: "Food saved successfully", save });
}

async function getSavedFoods(req, res) {
  try {
    // savesModel contains { user, food }
    const saves = await savesModel.find({ user: req.user._id }).lean();
    const foodIds = saves.map((s) => s.food);
    const foods = await foodModel.find({ _id: { $in: foodIds } }).lean();
    return res.status(200).json({
      message: "Saved foods fetched successfully",
      foods,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

// Add a comment to a food (User)
async function addComment(req, res) {
  try {
    const { foodId, text } = req.body;
    if (!foodId || !text)
      return res.status(400).json({ message: "foodId and text are required" });

    // optional: ensure food exists
    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const comment = await commentModel.create({
      food: foodId,
      user: req.user._id,
      text,
    });

    return res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

// List comments for a food (reverse chronological)
async function getComments(req, res) {
  try {
    const { foodId } = req.params;
    const comments = await commentModel
      .find({ food: foodId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ message: "Comments fetched", comments });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoods,
  addComment,
  getComments,
};
