const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();

const csvPath = "/tmp/data.csv";

// serve your css as static
app.use("/", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/",(req, res) => {
  fs.writeFile(csvPath, req.body.csvData, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  res.sendFile(__dirname + "/index.html");
});

app.get("/data", function (req, res) {
  try {
    if (fs.existsSync(csvPath)) {
      res.sendFile(csvPath);
    } else {
      res.sendFile(__dirname + "/public/data.csv");
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

module.exports = app;
