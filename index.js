const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const supplierRoute = require("./routes/supplier");
const medicineRoute = require("./routes/medicine");
const pembelianRoute = require("./routes/pembelian");
const penjualanRoute = require("./routes/penjualan");
const authRoute = require("./routes/auth");
const cors = require("cors");
const authenticateUser = require("./helper/authenticateToken");

const app = express();

app.use(cors());

dotenv.config();
// db connection with mongodb
const dbURI = "";
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connect to db");
    app.listen(27017, () => {
      console.log("ada di port 4000");
    });
  })
  .catch((err) => console.log(err));

// handle cors
app.use(cors());

// route for auth
app.use("/api/auth", authRoute);

// authenticate user login
app.use(authenticateUser);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// image url
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// routing
app.use("/api", supplierRoute);
app.use("/api", medicineRoute);
app.use("/api", pembelianRoute);
app.use("/api", penjualanRoute);

// handle error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send({ error: err.message });
});
