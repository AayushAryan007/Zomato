const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found" });
    }
    const foods = await foodModel.find({ foodPartner: foodPartnerId }).lean();

    return res.status(200).json({
      message: "Food Partner fetched successfully",
      foodPartner,
      foods, // array for client
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getFoodPartnerById };
