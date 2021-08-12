const mongoose = require("mongoose");
const crypto = require("crypto");
const moment = require("moment-timezone");
const { ObjectId } = mongoose.Schema;

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    ref: "User",
    required: true,
  },
  expires: { type: Date },
});

refreshTokenSchema.statics = {
  async generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString("hex")}`;
    const expiresIn = moment().add(30, "days").toDate();
    const tokenObject = new refreshToken({
      token,
      userId,
      userEmail,
      expires,
    });
    await tokenObject.save();
    return tokenObject;
  },
};

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
