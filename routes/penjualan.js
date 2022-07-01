const express = require("express");
const router = express.Router();
const penjualanController = require("../controller/penjualanController");

router.post("/penjualan", penjualanController.penjualan_post);
router.get("/penjualan", penjualanController.penjualan_get);
router.delete("/penjualan/:id", penjualanController.penjualan_delete);

module.exports = router;
