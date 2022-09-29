const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("./"));
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "../index.html"));
});
app.listen(8125);
console.log("Server listening at http://127.0.0.1:8125/");
