const express = require("express");
const connectToMongo = require("./database/db");

// connecting to database
connectToMongo();

// initializing the app
const app = express();
const port = 3000;

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
