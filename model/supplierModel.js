const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
    },

    image: {
      data: Buffer,
      contentType: String,
    },

    media: {
      defaultImage: {
        type: String,
      },
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
supplierSchema.plugin(autoIncrement.plugin, "supplier");
const supplier = mongoose.model("supplier", supplierSchema);
module.exports = { supplier, supplierSchema };
