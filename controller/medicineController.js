const { medicine } = require("../model/medicineModel");

module.exports.medicine_get = (req, res, next) => {
  medicine
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
          };
        });
        res.status(201).send(datas);
      }
    })
    .sort({ createdAt: -1 });
};

module.exports.medicine_post = (req, res, next) => {
  const { body } = req;
  console.log(req);
  medicine.create(body, (err, data) => {
    if (err) {
      res.status(400).send(err);
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
      res.status(400).send(err);
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
  medicine.findById(id, (err, data) => {
    if (err) {
      res.status(400).send(err);
      next();
    } else if (data) {
      res.status(201).send(data);
    } else {
      res.status(400).send("Not found");
      next();
    }
  });
};
