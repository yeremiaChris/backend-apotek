const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");

// medicine api
router.get("/medicine", medicineController.medicine_get);
router.get("/medicine/print", medicineController.medicine_print_get);
router.get("/medicine/select-data", medicineController.medicine_get_selectData);
router.get("/medicine/:id", medicineController.medicine_get_detail);
router.post("/medicine", medicineController.medicine_post);
router.delete("/medicine/:id", medicineController.medicine_delete);
router.put("/medicine/:id", medicineController.medicine_put);

module.exports = router;
