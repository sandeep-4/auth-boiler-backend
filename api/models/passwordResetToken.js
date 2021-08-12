const mongoose = require("mongoose");
const crypto = require("crypto");
const moment = require("moment-timezone");
const { ObjectId } = mongoose.Schema;

const passwordResetTokenSchema = new mongoose.Schema({
  resetToken: {
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

passwordResetTokenSchema.statics = {
  async generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString("hex")}`;
    const expiresIn = moment().add(2, "hours").toDate();
    const ResetTokenObject = new PasswordResetToken({
      resetToken,
      userId,
      userEmail,
      expires,
    });
    await ResetTokenObject.save();
    return ResetTokenObject;
  },
};

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
