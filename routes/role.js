const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const role = require("../controller/role");
router.get("/user", auth.user_get);
router.get("/user/:id", auth.user_get_detail);
router.delete("/user/:id", auth.user_delete);
router.get("/", role.role_get);
router.get("/select-data", role.role_get_selectData);
router.get("/:id", role.role_get_detail);
router.post("/", role.role_post);
router.delete("/:id", role.role_delete);
router.put("/:id", role.role_put);

module.exports = router;
