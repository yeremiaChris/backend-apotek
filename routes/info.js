const express = require("express");
const router = express.Router();
const info = require("../controller/info");
router.get("/total-data", info.get_total);

module.exports = router;
