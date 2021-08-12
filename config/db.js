const mongoose = require("mongoose");
const { mongo, env } = require("./vars");
const logger = require("./logger");

if (process.env.NODE_ENV === "developement") {
  logger.error("debug", true);
}

// console.log(mongo);

exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      keepAlive: 1,
    })
    .then(() => {
      console.log("Connecte to mongoDb");
    })
    .catch((err) => {
      console.log("unable to connect to mongo");
      console.log(err);
      process.exit(1);
    });
};
