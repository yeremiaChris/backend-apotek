const jwt = require("jsonwebtoken");

module.exports = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30h" });
};
