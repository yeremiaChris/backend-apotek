const { satuan } = require("../model/satuan");

module.exports.satuan_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;
  try {
    const data = await satuan
      .find({
        $or: [{ title: { $regex: query || "" } }, { description: { $regex: query || "" } }],
      })
      .sort(sortBy || "-createdAt")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await satuan.countDocuments();

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

module.exports.satuan_get_selectData = (req, res, next) => {
  satuan
    .find({}, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else {
        console.log(data);
        const datas = data.map((item) => {
          return {
            title: item.title,
            description: item.description,
            _id: item._id,
          };
        });
        res.status(201).send(datas);
      }
    })
    .sort({ createdAt: -1 })
    .lean();
};

module.exports.satuan_post = (req, res, next) => {
  const { body } = req;
  console.log(req);
  satuan.create(body, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Satuan obat sudah tersedia." });
      } else {
        res.status(400).send(err);
      }
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.satuan_put = (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  satuan.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Satuan obat sudah tersedia." });
      } else {
        res.status(400).send(err);
      }
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.satuan_delete = (req, res, next) => {
  const { id } = req.params;
  satuan.findById(id, (err, data) => {
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

module.exports.satuan_get_detail = (req, res, next) => {
  const { id } = req.params;
  satuan
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
