const express = require("express");
const connectToMongo = require("./database/db");
const bodyParser = require("body-parser");

// connecting to database
connectToMongo();

// initializing the app
const app = express();
const port = 3000;

// used to access the payload
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// API routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/employee", require("./routes/employee"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
