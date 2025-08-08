const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} = require("../controllers/maintenanceController");

router.get("/", auth, getMaintenanceRecords);
router.post("/", auth, createMaintenanceRecord);
router.put("/:id", auth, updateMaintenanceRecord);
router.delete("/:id", auth, deleteMaintenanceRecord);

module.exports = router;
