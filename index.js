const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./config/db");
require("dotenv").config();
const apiRouter = require("./routes/api");
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
connect();

app.use("/api", apiRouter);



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
