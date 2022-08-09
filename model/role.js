const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema;
const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: [true, "Role name field is required"],
    },
    menus: [{}],
  },
  { timestamps: true }
);
autoIncrement.initialize(mongoose.connection);
roleSchema.plugin(autoIncrement.plugin, "role");
const role = mongoose.model("role", roleSchema);
module.exports = { role, roleSchema };
