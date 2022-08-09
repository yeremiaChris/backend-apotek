const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");

router.post("/register", auth.register_post);
router.put("/register/:id", auth.register_put);
router.post("/login", auth.login_post);
router.post("/token", auth.token_post);

module.exports = router;
