const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");

router.get("/", auth, getCars);
router.get("/:id", auth, getCarById);
router.post("/", auth, createCar);
router.put("/:id", auth, updateCar);
router.delete("/:id", auth, deleteCar);

module.exports = router;
