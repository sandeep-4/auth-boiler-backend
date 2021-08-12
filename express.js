const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const routes = require("./api/routes");
const { logs } = require("./config/vars");
const strategies = require("./config/passport");
const error = require("./api/middlewares/error");

app.use(express.json());
app.use(morgan(logs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());
//security headers
app.use(helmet());
app.use(cors());

app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
passport.use("facebook", strategies.facebook);
passport.use("google", strategies.google);

app.use("/v1", routes);

app.use(error.converter);
app.use(error.notfound);
app.use(error.handler);

module.exports = app;
