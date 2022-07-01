const express = require("express");
const router = express.Router();
const pembelianController = require("../controller/pembelianController");

// pembelian api
router.get("/pembelian", pembelianController.pembelian_get);
router.post("/pembelian", pembelianController.pembelian_post);
router.delete("/pembelian/:id", pembelianController.pembelian_delete);

module.exports = router;
