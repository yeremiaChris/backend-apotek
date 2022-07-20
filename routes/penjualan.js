const express = require("express");
const router = express.Router();
const penjualanController = require("../controller/penjualanController");

router.post("/", penjualanController.penjualan_post);
router.get("/", penjualanController.penjualan_get);
router.get("/print", penjualanController.penjualan_print_get);
router.get("/terbaru", penjualanController.penjualan_newest);
router.delete("/:id", penjualanController.penjualan_delete);

module.exports = router;
