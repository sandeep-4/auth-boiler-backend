const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { jwtExpirationInterval } = require("../../config/vars");
const APIError = require("../errors/api-error");
const emailProvider = require("../services/emails/emailProvider");

function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, "role");
    const user = await new User(userData).save();
    const userTransformed = user.transfrom();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({
      token,
      user: userTransformed,
    });
  } catch (error) {
    return next(User.checkDublicateEmail(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transfrom();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = await user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transfrom();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json("success");
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: "No account found",
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = "Token not found";
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = "Token expired";
      throw new APIError(err);
    }
    const user = await User.findOne({
      email: resetTokenObject.userEmail,
    }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);
    res.status(httpStatus.OK);
    return res.json("Password updated");
  } catch (error) {
    return next(error);
  }
};
