const express = require("express");
const cors = require("cors");
const app = express();
const requestDataExtractionController = require("./controller/request-data-extraction-controller")

app.use(cors());
app.use(express.json())

app.post("/request-data-extraction", requestDataExtractionController)

app.listen(3000, function() {
    console.log("Runnning on ");
  });

  module.exports = app;