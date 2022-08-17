const { role } = require("../model/role");

module.exports.role_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;
  try {
    const data = await role
      .find({
        $or: [{ roleName: { $regex: query || "" } }],
      })
      .sort(sortBy || "-createdAt")
      .select(["-menus"])
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await role.countDocuments();

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

module.exports.role_post = (req, res, next) => {
  const { body } = req;
  console.log(body);
  role.create(body, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.role_put = (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  console.log(body);
  role.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.role_get_detail = (req, res, next) => {
  const { id } = req.params;
  role
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

module.exports.role_delete = (req, res, next) => {
  const { id } = req.params;
  role.findById(id, (err, data) => {
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

module.exports.role_get_selectData = (req, res, next) => {
  role
    .find({}, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else {
        res.status(201).send(data);
      }
    })
    .sort({ createdAt: -1 })
    .lean();
};
