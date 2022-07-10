const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");

// medicine api
router.get("/", medicineController.medicine_get);
router.get("/print", medicineController.medicine_print_get);
router.get("/select-data", medicineController.medicine_get_selectData);
router.get("/:id", medicineController.medicine_get_detail);
router.post("/", medicineController.medicine_post);
router.delete("/:id", medicineController.medicine_delete);
router.put("/:id", medicineController.medicine_put);

module.exports = router;
