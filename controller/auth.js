const { user } = require("../model/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../helper/generateAccessToken");
const { role } = require("../model/role");

module.exports.user_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;
  try {
    const data = await user
      .find({
        $or: [{ name: { $regex: query || "" } }, { email: { $regex: query || "" } }],
      })
      .sort({
        [sortBy]: 1,
      })
      .select(["-password", "-refreshToken"])
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await user.countDocuments();

    res.json({
      data,
      pagination: {
        page: !page ? 1 : parseInt(page),
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next();
  }
};

module.exports.user_delete = (req, res, next) => {
  const { id } = req.params;
  user.findById(id, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    } else if (data) {
      data.remove(() => {
        res.status(201).send(data);
      });
    } else {
      res.status(400).send("Not found");
      next();
    }
  });
};

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
  if (!body.role) {
    res.status(400).send({ message: "Role field is required" });
  } else {
    const roleValue = await role.findById(parseInt(body.role));
    user.create(
      { ...body, role: roleValue, refreshToken, password: hashedPassword },
      (err, data) => {
        if (err) {
          res.status(400).send(err);
          next();
        }
        res.status(201).json(data);
      }
    );
  }
};

// module.exports.user_put = (req, res, next) => {
//   const { body } = req;
//   const { id } = req.params;
//   user.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
//     if (err) {
//       res.status(400).send(err);
//       next();
//     }
//     res.status(201).send(data);
//   });
// };

module.exports.user_get_detail = (req, res, next) => {
  const { id } = req.params;
  user
    .findById(id, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else if (data) {
        res.status(201).send(data);
      } else {
        res.status(400).send("Not found");
        next();
      }
    })
    .lean();
};

module.exports.register_put = async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const { password } = body;

  // create user

  if (password) {
    if (!body.role) {
      res.status(400).send({ message: "Role field is required" });
    } else {
      const roleValue = await role.findById(parseInt(body.role));
      const refreshToken = jwt.sign(body, process.env.REFRESH_TOKEN_SECRET);
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.findByIdAndUpdate(
        id,
        { ...body, role: roleValue, refreshToken, password: hashedPassword },
        { new: true },
        (err, data) => {
          if (err) {
            res.status(400).send(err);
            next();
          }
          res.status(201).send(data);
        }
      );
    }
  } else {
    user.findByIdAndUpdate(id, { ...body, role: roleValue }, { new: true }, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      }
      res.status(201).send(data);
    });
  }

  // user.create({ ...body, role: roleValue, refreshToken, password: hashedPassword }, (err, data) => {
  //   if (err) {
  //     res.status(400).send(err);
  //     next();
  //   }
  //   res.status(201).json(data);
  // });
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
