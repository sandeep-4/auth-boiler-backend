const path = require("path");

// require("dotenv-safe").load({
//   path: path.join(__dirname, "../../.env"),
// });
require("dotenv").config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTE,
  mongo: {
    uri:
      process.env.NODE_ENV === "developement"
        ? process.env.MONGODB
        : process.env.MONGODB,
  },
  logs: process.env.NODE_ENV === "developement" ? "dev" : "combined",
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
};
