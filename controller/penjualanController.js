const penjualan = require("../model/penjualan");
const { medicine } = require("../model/medicine");
const dayjs = require("dayjs");
module.exports.penjualan_get = async (req, res, next) => {
  const limit = 5;
  const { page, query } = req.query;
  console.log(query);
  try {
    const data = await penjualan
      .find({
        title: {
          $regex: !query ? "" : query,
          $options: "i",
        },
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const count = await penjualan.countDocuments();

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

module.exports.penjualan_print_get = async (req, res, next) => {
  try {
    const data = await penjualan.find().lean();
    res.json(data);
  } catch (error) {
    next();
  }
};

module.exports.penjualan_post = (req, res, next) => {
  const { body } = req;
  console.log(body);
  penjualan.create(body, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    }
    res.status(201).send(data);
    console.log(data);
    const id = data._id;

    // const item = Meme.findOne(query);

    // add supply for transaction
    for (let index = 0; index < data.laporan.length; index++) {
      medicine.findByIdAndUpdate(
        { _id: data.laporan[index]._id },
        { $inc: { supply: -parseInt(data.laporan[index].jumlahBeli) } },
        { new: true },
        (err1, data1) => {
          if (err) {
            console.log(err1);
          }
          console.log(data1);
        }
      );
    }
  });
};

module.exports.penjualan_delete = (req, res, next) => {
  const { id } = req.params;
  penjualan.findById(id, (err, data) => {
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

module.exports.penjualan_newest = async (req, res, next) => {
  const limit = 5;
  const { page, query } = req.query;
  console.log(query);
  try {
    const data = await penjualan
      .find({
        title: {
          $regex: !query ? "" : query,
          $options: "i",
        },
        createdAt: {
          $gte: dayjs(),
          $lt: dayjs(),
        },
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const count = await penjualan.countDocuments({
      createdAt: {
        $gte: dayjs(),
        $lt: dayjs(),
      },
    });

    res.json({
      data,
      pagination: {
        page: !page ? 1 : parseInt(page),
        totalPage: count === 0 ? 1 : Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
