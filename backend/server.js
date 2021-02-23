const express = require("express");
const app = express();
const port = 80;

const bodyParser = require("body-parser");
const router = require("./routes");

const cors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: true });

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use([jsonParser, urlParser]);

app.use(
  "/polkadot/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use("/polkadot", router);

app.listen(port, () => console.log(`server started on port ${port}!`));
