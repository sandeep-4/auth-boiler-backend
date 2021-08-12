const express = require("express");
const router = express.Router();
const validate = require("express-validation");
const {
  register,
  login,
  refresh,
  sendPasswordReset,
  passwordReset,
  oAuth,
} = require("../validations/auth");
const oAuthLogin = require("../middlewares/auth").oAuth;

const controller = require("../controllers/auth");

router.post("/register", validate(register), controller.register);
router.post("/login", validate(login), controller.login);
router.post("/refresh-token", validate(refresh), controller.refresh);
router.post(
  "/send-password-reset",
  validate(sendPasswordReset),
  controller.sendPasswordReset
);
router.post(
  "/reset-password",
  validate(passwordReset),
  controller.resetPassword
);

router.post(
  "/facebook",
  validate(oAuth),
  oAuthLogin("facebook"),
  controller.oAuth
);
router.post("/google", validate(oAuth), oAuthLogin("google"), controller.oAuth);
module.exports = router;
