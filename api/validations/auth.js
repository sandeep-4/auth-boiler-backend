const Joi = require("joi");

module.exports = {
  register: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(255),
    },
  },

  login: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(255),
    },
  },

  oAuth: {
    body: {
      access_token: Joi.string().required(),
    },
  },

  refresh: {
    body: {
      email: Joi.string().email().required(),
      refreshToken: Joi.string().required(),
    },
  },

  sendPasswordReset: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  passwordReset: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(255),
      resetToken: Joi.string().required(),
    },
  },
};
