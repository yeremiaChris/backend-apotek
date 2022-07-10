const express = require("express");
const router = express.Router();
const pembelianController = require("../controller/pembelianController");

// pembelian api
router.get("/", pembelianController.pembelian_get);
router.post("/", pembelianController.pembelian_post);
router.delete("/:id", pembelianController.pembelian_delete);

module.exports = router;
