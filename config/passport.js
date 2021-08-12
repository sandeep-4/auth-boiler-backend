const JwtStrategy = require("passport").Strategy;
const BrearerStrategy = require("passport-http-bearer");
const { ExtractJwt } = require("passport-jwt");
const { jwtSecret } = require("./vars");
const authProviders = require("../api/services/authProviders");
const User = require("../api/models/user");

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service) => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BrearerStrategy(oAuth("facebook"));
exports.google = new BrearerStrategy(oAuth("google"));
