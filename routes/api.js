const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");
const supplierController = require("../controller/supplierController");

// medicine api
router.get("/medicine", medicineController.medicine_get);
router.get("/medicine/:id", medicineController.medicine_get_detail);
router.post("/medicine", medicineController.medicine_post);
router.delete("/medicine/:id", medicineController.medicine_delete);
router.put("/medicine/:id", medicineController.medicine_put);

// supplier api
router.get("/supplier", supplierController.supplier_get);
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

router.post(
  "/supplier",
  upload.single("image"),
  supplierController.supplier_post
);

router.delete("/supplier/:id", supplierController.supplier_delete);

router.put(
  "/supplier/:id",
  upload.single("image"),
  supplierController.supplier_put
);

router.get("/supplier/:id", supplierController.supplier_get_detail);

module.exports = router;
