const penjualan = require("../model/penjualan");
const { medicine } = require("../model/medicine");

module.exports.penjualan_get = async (req, res, next) => {
  const limit = 2;
  const { page, query, sortBy } = req.query;

  try {
    const data = await penjualan
      .find({
        name: {
          $regex: !query ? "" : query,
          $options: "i",
        },
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ name: sortBy === "name" ? 1 : -1, price: sortBy === "price" ? 1 : -1, supply: sortBy === "supply" ? 1 : -1, createdAt: -1, updatedAt: -1 })
      .exec();

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
      medicine.findByIdAndUpdate({ _id: data.laporan[index]._id }, { $inc: { supply: -parseInt(data.laporan[index].jumlahBeli) } }, { new: true }, (err1, data1) => {
        if (err) {
          console.log(err1);
        }
        console.log(data1);
      });
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
