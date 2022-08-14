const pembelian = require("../model/pembelian");
const { medicine } = require("../model/medicine");

module.exports.pembelian_get = async (req, res, next) => {
  const limit = 5;
  const { page, query, sortBy } = req.query;

  try {
    let data = await pembelian
      .find({
        $or: [{ title: { $regex: query || "" } }],
      })
      .sort({
        [sortBy]: 1,
        createdAt: -1,
      })
      .limit(limit)
      .skip((page - 1) * limit)
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
  //  update data obat persediaan bertambah
  console.log(body);
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

    // const item = Meme.findOne(query);
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
