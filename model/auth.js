const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    refreshToken: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, "user");
const user = mongoose.model("User", userSchema);
module.exports = { user, userSchema };
