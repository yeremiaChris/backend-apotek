const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/api");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());

// db connection with mongodb
const dbURI =
  "mongodb+srv://penjualan-obat:pass789@cluster0.0r1il.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connect to db");
    app.listen(4000, () => {
      console.log("ada di port 4000");
    });
  })
  .catch((err) => console.log(err));

app.use(cors());
// body-parser for expres 4 above
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// image url
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(__dirname + "/uploads"));

// routing
app.use("/api", router);

// handle error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send({ error: err.message });
});
