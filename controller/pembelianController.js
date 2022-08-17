const pembelian = require("../model/pembelian");
const { medicine } = require("../model/medicine");
const dayjs = require("dayjs");

module.exports.pembelian_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy, startDate, endDate } = req.query;
  try {
    const total = await pembelian
      .find({
        $or: [
          { name: { $regex: query || "" } },
          { type: { $regex: query || "" } },
          { unit: { $regex: query || "" } },
          { "supplier.title": { $regex: query || "" } },
        ],
        createdAt: {
          $gte: !startDate ? dayjs().subtract(1, "year") : new Date(startDate),
          $lte: !endDate ? dayjs() : new Date(endDate),
        },
      })
      .sort(sortBy || "-createdAt");

    const data = await pembelian
      .find({
        $or: [
          { name: { $regex: query || "" } },
          { type: { $regex: query || "" } },
          { unit: { $regex: query || "" } },
          { "supplier.title": { $regex: query || "" } },
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

    const count = await pembelian.countDocuments().lean();
    res.json({
      data,
      totalPembelian: total.reduce((a, c) => a + c.total, 0),
      totalJumlahBeli: total.reduce((a, c) => a + c.jumlahBeli, 0),
      pagination: {
        page: !page ? 1 : parseInt(page),
        totalPage: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.pembelian_print_get = async (req, res, next) => {
  try {
    const data = await pembelian.find().lean();
    res.json(data);
  } catch (error) {
    next();
  }
};

module.exports.pembelian_post = (req, res, next) => {
  const { body } = req;
  //  update data obat persediaan bertambah
  medicine.findByIdAndUpdate(
    { _id: body._id },
    { $inc: { supply: parseInt(body.jumlahBeli) } },
    { new: true },
    (err1, data1) => {
      if (err1) {
        console.log(err1);
      }
      console.log(data1);
    }
  );

  // buat laporan pembelian
  const { name, type, unit, purchasePrice, sellingPrice, supply, jumlahBeli, supplier, total } =
    body;
  const data = {
    name,
    type,
    unit,
    purchasePrice,
    sellingPrice,
    supply,
    jumlahBeli,
    total,
    supplier,
  };
  pembelian.create(data, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
    console.log(data);
  });
};

module.exports.pembelian_delete = (req, res, next) => {
  const { id } = req.params;
  pembelian.findById(id, (err, data) => {
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
