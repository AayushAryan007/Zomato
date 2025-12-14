const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/foodpartner.controller");

//  get /api/food/foodpartner/:id
router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  foodController.getFoodPartnerById
);


module.exports = router;