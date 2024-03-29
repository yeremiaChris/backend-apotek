const { supplier } = require("../model/supplier");
const fs = require("fs");
const path = require("path");

module.exports.supplier_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;

  try {
    const data = await supplier
      .find({
        $or: [{ name: { $regex: query || "" } }],
      })
      .sort(sortBy || "-createdAt")
      .select("-image")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    const count = await supplier.countDocuments().lean();

    res.json({
      data,
      pagination: {
        page: !page ? 1 : parseInt(page),
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.supplier_print_get = async (req, res, next) => {
  try {
    const data = await supplier.find().select("-image").lean();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.supplier_getSelectData = (req, res, next) => {
  supplier
    .find({}, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else {
        const datas = data.map((item) => {
          return {
            title: item.name,
            _id: item._id,
          };
        });
        res.status(201).send(datas);
      }
    })
    .sort({ createdAt: -1 })
    .select("-image")
    .lean();
  // .limit(2)
  // .select("-image");
};

module.exports.supplier_post = (req, res, next) => {
  console.log(req.file);
  const obj = {
    name: req.body.name,
    image: {
      data: fs.readFileSync(path.join("./uploads/" + req.file.filename)),
      contentType: req.file.mimetype,
    },
    media: {
      defaultImage: req.file.filename,
    },
  };
  supplier.create(obj, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Supplier sudah tersedia." });
      } else {
        res.status(400).send(err);
      }
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.supplier_put = (req, res, next) => {
  const obj = {
    name: req.body.name,
    image: {
      data: !req.file
        ? ""
        : fs.readFileSync(path.join(process.cwd() + "/uploads/" + req.file.filename)),
      contentType: "image/png",
    },
    media: {
      defaultImage: !req.file ? "" : req.file.filename,
    },
  };

  const obj2 = {
    name: req.body.name,
  };

  const { id } = req.params;

  supplier.findByIdAndUpdate(id, !req.file ? obj2 : obj, { new: true }, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Supplier sudah tersedia." });
      } else {
        res.status(400).send(err);
      }
      next();
    }
    res.status(201).send(data);
  });
};

module.exports.supplier_delete = (req, res, next) => {
  const { id } = req.params;
  supplier.findById(id, (err, data) => {
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

module.exports.supplier_get_detail = (req, res, next) => {
  const { id } = req.params;
  supplier
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
    .select("-image")
    .lean();
};
