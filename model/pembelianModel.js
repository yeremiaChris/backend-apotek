const mongoose = require("mongoose");
// const { supplierSchema } = require("./supplierModel");
// const { medicineSchema } = require("./medicineModel");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const pembelianSchema = new Schema(
  {
    supplier: {
      any: Schema.Types.Mixed,
    },
    medicine: {
      any: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
pembelianSchema.plugin(autoIncrement.plugin, "pembelian");
const pembelian = mongoose.model("pembelian", pembelianSchema);
module.exports = pembelian;
