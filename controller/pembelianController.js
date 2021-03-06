const pembelian = require("../model/pembelian");
const { medicine } = require("../model/medicine");

module.exports.pembelian_get = async (req, res, next) => {
  const limit = 5;
  const { page, query } = req.query;

  try {
    const data = await pembelian
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

    const count = await pembelian.countDocuments().lean();

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
  console.log(body);
  pembelian.create(body, (err, data) => {
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
        { $inc: { supply: parseInt(data.laporan[index].jumlahBeli) } },
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
