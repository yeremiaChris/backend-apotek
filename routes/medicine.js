const express = require("express");
const router = express.Router();
const medicineController = require("../controller/medicineController");
const jenisController = require("../controller/jenis");
const satuanController = require("../controller/satuan");

// medicine api
router.get("/", medicineController.medicine_get);
// jenis
router.get("/jenis", jenisController.jenis_get);
router.get("/jenis/select-data", jenisController.jenis_get_selectData);
router.post("/jenis", jenisController.jenis_post);
router.put("/jenis/:id", jenisController.jenis_put);
router.delete("/jenis/:id", jenisController.jenis_delete);
router.get("/jenis/:id", jenisController.jenis_get_detail);
// satuan
router.get("/satuan", satuanController.satuan_get);
router.get("/satuan/select-data", satuanController.satuan_get_selectData);
router.post("/satuan", satuanController.satuan_post);
router.put("/satuan/:id", satuanController.satuan_put);
router.delete("/satuan/:id", satuanController.satuan_delete);
router.get("/satuan/:id", satuanController.satuan_get_detail);

router.get("/print", medicineController.medicine_print_get);
router.get("/select-data", medicineController.medicine_get_selectData);
router.get("/:id", medicineController.medicine_get_detail);
router.post("/", medicineController.medicine_post);
router.delete("/:id", medicineController.medicine_delete);
router.put("/:id", medicineController.medicine_put);

module.exports = router;
