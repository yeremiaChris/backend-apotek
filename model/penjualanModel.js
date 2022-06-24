const mongoose = require("mongoose");
// const { supplierSchema } = require("./supplierModel");
// const { medicineSchema } = require("./medicineModel");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const penjualanSchema = new Schema(
  {
    laporan: [{}],
    title: {
      type: String,
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
penjualanSchema.plugin(autoIncrement.plugin, "penjualan");
const penjualan = mongoose.model("penjualan", penjualanSchema);
module.exports = penjualan;
