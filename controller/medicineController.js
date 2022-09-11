const { medicine } = require("../model/medicine");
const Crypto = require("crypto");
const dayjs = require("dayjs");

module.exports.medicine_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy, startDate, endDate } = req.query;

  try {
    const total = await medicine
      .find({
        $or: [
          { name: { $regex: query || "" } },
          { type: { $regex: query || "" } },
          { unit: { $regex: query || "" } },
        ],
        createdAt: {
          $gte: !startDate ? dayjs().subtract(1, "year") : new Date(startDate),
          $lte: !endDate ? dayjs() : new Date(endDate),
        },
      })
      .sort(sortBy || "-createdAt");
    const data = await medicine
      .find({
        $or: [
          { name: { $regex: query || "" } },
          { type: { $regex: query || "" } },
          { unit: { $regex: query || "" } },
        ],
        createdAt: {
          $gte: !startDate ? dayjs().subtract(1, "year") : new Date(startDate),
          $lte: !endDate ? dayjs() : new Date(endDate),
        },
      })
      .sort(sortBy || "-createdAt")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await medicine.countDocuments();

    res.json({
      data,
      totalPersediaan: total.reduce((a, c) => a + c.supply, 0),
      pagination: {
        page: !page ? 1 : parseInt(page),
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next();
  }
};

module.exports.medicine_print_get = async (req, res, next) => {
  try {
    const data = await medicine.find().lean();
    res.json(data);
  } catch (error) {
    next();
  }
};

module.exports.medicine_get_selectData = (req, res, next) => {
  medicine
    .find({}, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else {
        console.log(data);
        const datas = data.map((item) => {
          return {
            title: item.name,
            _id: item._id,
            price: item.price,
            supply: item.supply,
            expiredAt: item.expiredAt,
          };
        });
        res.status(201).send(datas);
      }
    })
    .sort({ createdAt: -1 })
    .lean();
};

function randomString(size = 5) {
  return Crypto.randomBytes(size).toString("base64").slice(0, size);
}

module.exports.medicine_post = (req, res, next) => {
  const { body } = req;
  medicine.create({ ...body, kode: randomString() }, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Obat sudah tersedia." });
      } else {
        res.status(400).send(err);
      }

      next();
    }
    res.status(201).send(data);
  });
};

module.exports.medicine_put = (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  medicine.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
    if (err) {
      if (11000 === err.code || 11001 === err.code) {
        res.status(400).send({ err, message: "Obat sudah tersedia." });
      } else {
        res.status(400).send(err);
      }

      next();
    }
    res.status(201).send(data);
  });
};

module.exports.medicine_delete = (req, res, next) => {
  const { id } = req.params;
  medicine.findById(id, (err, data) => {
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

module.exports.medicine_get_detail = (req, res, next) => {
  const { id } = req.params;
  medicine
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
