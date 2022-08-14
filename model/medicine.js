const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;

// obj schema
const medicineObjSchema = {
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: [true, "Type field is required"],
  },
  unit: {
    type: String,
    required: [true, "Unit field is required"],
  },
  purchasePrice: {
    type: Number,
    required: [true, "Price field is required"],
  },
  sellingPrice: {
    type: Number,
    required: [true, "Price field is required"],
  },
  supply: {
    type: Number,
    required: [true, "Supply field is required"],
  },
};
const medicineObjSchema2 = {
  name: {
    type: String,
    required: true,
    unique: [true, "Medicine is available"],
  },
  type: {
    type: String,
    required: [true, "Type field is required"],
  },
  unit: {
    type: String,
    required: [true, "Unit field is required"],
  },
  purchasePrice: {
    type: Number,
    required: [true, "Price field is required"],
  },
  sellingPrice: {
    type: Number,
    required: [true, "Price field is required"],
  },
  supply: {
    type: Number,
    required: [true, "Supply field is required"],
  },
};

// create schema
const medicineSchema = new Schema(
  {
    ...medicineObjSchema2,
  },
  { timestamps: true }
);
// autoIncrement.initialize(mongoose.connection);
// medicineSchema.plugin(autoIncrement.plugin, "medicine");
const medicine = mongoose.model("medicine", medicineSchema);
module.exports = { medicine, medicineSchema, medicineObjSchema };
