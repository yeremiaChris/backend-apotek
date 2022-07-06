const { user } = require("../model/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../helper/generateAccessToken");

module.exports.register_post = async (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  const refreshToken = jwt.sign(body, process.env.REFRESH_TOKEN_SECRET);

  // checking if email exist
  const isEmailExist = await user.findOne({ email });
  if (isEmailExist) return res.status(400).send({ message: "Email is already exist." });

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  user.create({ ...body, refreshToken, password: hashedPassword }, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).json(data);
  });
};

module.exports.login_post = async (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  // checking if email exist
  const isUser = await user.findOne({ email });
  if (!isUser) return res.status(400).send({ message: "Email is not found" });
  // checkin password correct
  const validPass = await bcrypt.compare(password, isUser.password);
  if (!validPass) return res.status(400).send({ message: "Invalid password" });

  // create and sign a token
  const token = generateAccessToken({ name: user.name });

  // set authorization
  res.json({ message: "success", data: isUser, token });
};

module.exports.token_post = async (req, res, next) => {
  const { token } = req.body;
  const isToken = await user.findOne({ refreshToken: token });
  if (!isToken) res.status(401);
  jwt.verify(isToken.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.status(403);
    const token = generateAccessToken({ name: user.name });
    // set authorization
    res.json({ message: "success", data: user, token });
  });
};
