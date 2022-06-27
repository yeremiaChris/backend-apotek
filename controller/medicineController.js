const { medicine } = require("../model/medicineModel");

module.exports.medicine_get = async (req, res, next) => {
  const limit = 2;
  const { page, query, sortBy } = req.query;

  try {
    const data = await medicine
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

    const count = await medicine.countDocuments();

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

module.exports.medicine_print_get = async (req, res, next) => {
  const limit = 2;
  const { page, query, sortBy } = req.query;

  try {
    const data = await medicine.find();
    res.json(data);
  } catch (error) {
    console.log(error);
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
