const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const satuanSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
    },
    description: {
      type: String,
      required: [true, "Description field is required"],
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
satuanSchema.plugin(autoIncrement.plugin, "satuan");
const satuan = mongoose.model("satuan", satuanSchema);
module.exports = { satuan, satuanSchema };
