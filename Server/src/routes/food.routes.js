const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controler");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});
// prefix hai iska -> /api/food/   [protexted] -> sirf foodpartner add karega (middleware ko use karenge protect karne ke lie via saved cookie during auth)
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);

//  get /api/food -> protected

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  foodController.likeFood
);

router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  foodController.saveFood
);

module.exports = router;
