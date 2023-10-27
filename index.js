const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// MIDDLE_WARES
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ASSIGNMENT 10 SERVER IS RUNNING)");
});

app.listen(port, () => {
  console.log(`Server running on port no: ${port}`);
});
