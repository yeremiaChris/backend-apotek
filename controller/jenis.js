const { jenis } = require("../model/jenis");

module.exports.jenis_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;

  try {
    const data = await jenis
      .find({
        title: {
          $regex: !query ? "" : query,
          $options: "i",
        },
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await jenis.countDocuments();

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

module.exports.jenis_post = (req, res, next) => {
  const { body } = req;
  console.log(req);
  jenis.create(body, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.jenis_put = (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  jenis.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.jenis_delete = (req, res, next) => {
  const { id } = req.params;
  jenis.findById(id, (err, data) => {
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

module.exports.jenis_get_detail = (req, res, next) => {
  const { id } = req.params;
  jenis
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
