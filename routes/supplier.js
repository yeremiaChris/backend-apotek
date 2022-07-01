const express = require("express");
const router = express.Router();
const supplierController = require("../controller/supplierController");

// supplier api
router.get("/supplier", supplierController.supplier_get);
router.get("/supplier/print", supplierController.supplier_print_get);
router.get("/supplier/select-data", supplierController.supplier_getSelectData);
router.get("/supplier/:id", supplierController.supplier_get_detail);
// router.post("/supplier", supplierController.supplier_post);

// uploading files
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // let path = "/uploads";
    // cb(null, process.cwd() + path);
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/supplier", upload.single("image"), supplierController.supplier_post);

router.delete("/supplier/:id", supplierController.supplier_delete);

router.put("/supplier/:id", upload.single("image"), supplierController.supplier_put);

router.get("/supplier/:id", supplierController.supplier_get_detail);

// last uploading file

module.exports = router;
