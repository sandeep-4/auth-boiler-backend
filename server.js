const express = require("express");
const app = require("./express");
const mongoose = require("./config/db");
const logger = require("./config/logger");
const { env, port } = require("./config/vars");

mongoose.connect();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
