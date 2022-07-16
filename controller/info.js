const { medicine } = require("../model/medicine");
const { supplier } = require("../model/supplier");
const pembelian = require("../model/pembelian");
const penjualan = require("../model/penjualan");

module.exports.get_total = async (req, res, next) => {
  try {
    const medicineData = await medicine.countDocuments({}).exec();
    const supplierData = await supplier.countDocuments({}).exec();
    const pembelianData = await pembelian.countDocuments({}).exec();
    const penjualanData = await penjualan.countDocuments({}).exec();
    const data = [
      { title: "Obat", isHover: false, url: "/obat/list", total: medicineData },
      { title: "Supplier", isHover: false, url: "/supplier/list", total: supplierData },
      { title: "Pembelian", isHover: false, url: "/laporan/pembelian", total: pembelianData },
      { title: "Penjualan", isHover: false, url: "/laporan/pembelian", total: penjualanData },
    ];
    res.json({ data });
  } catch (error) {
    next();
  }
};
