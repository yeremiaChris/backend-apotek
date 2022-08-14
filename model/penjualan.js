const mongoose = require("mongoose");
// const { supplierSchema } = require("./supplierModel");
// const { medicineSchema } = require("./medicineModel");
const autoIncrement = require("mongoose-auto-increment");
const { medicineObjSchema } = require("./medicine");

const Schema = mongoose.Schema;
const penjualanSchema = new Schema(
  {
    ...medicineObjSchema,
    jumlahBeli: {
      type: Number,
    },
    isRecipi: {
      type: Boolean,
    },
    recepiData: {
      type: Object,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
penjualanSchema.plugin(autoIncrement.plugin, "penjualan");
const penjualan = mongoose.model("penjualan", penjualanSchema);
module.exports = penjualan;
