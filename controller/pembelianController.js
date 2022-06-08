const pembelian = require("../model/pembelianModel");

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
