const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const jenisSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
      unique: [true, "Title is available"],
    },
    description: {
      type: String,
      required: [true, "Description field is required"],
    },
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
jenisSchema.plugin(autoIncrement.plugin, "jenis");
const jenis = mongoose.model("jenis", jenisSchema);
module.exports = { jenis, jenisSchema };
