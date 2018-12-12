const express = require("express");
const fileupload = require("express-fileupload");

const app = express();

app.use(fileupload());

app.get("/upload", function(req, res) {
  // console.log(req.body);
  res.send("hello");
});

app.post("/upload", function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + "/files/" + sampleFile.name, function(err) {
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

app.listen(3000, function() {
  console.log("Listening on port 3000...");
});
