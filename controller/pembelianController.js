const pembelian = require("../model/pembelianModel");
const { medicine } = require("../model/medicineModel");

module.exports.pembelian_get = (req, res, next) => {
  pembelian
    .find({}, (err, data) => {
      if (err) {
        res.status(400).send(err);
        next();
      } else {
        res.status(201).send(data);
      }
    })
    .sort({ createdAt: -1 });
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
