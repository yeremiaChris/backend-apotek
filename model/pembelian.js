const mongoose = require("mongoose");
const { medicineObjSchema } = require("./medicine");
// const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const pembelianSchema = new Schema(
  {
    ...medicineObjSchema,
    jumlahBeli: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);
// autoIncrement.initialize(mongoose.connection);
// pembelianSchema.plugin(autoIncrement.plugin, "pembelian");
const pembelian = mongoose.model("pembelian", pembelianSchema);
module.exports = pembelian;
