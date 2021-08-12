const Email = require("email-templates");
const nodemailer = require("nodemailer");
const { emailConfig } = require("../../../config/vars");

// const transporter = nodemailer.createTransport({
//   port: emailConfig.port,
//   host: emailConfig.host,
//   auth: {
//     user: emailConfig.username,
//     pass: emailConfig.password,
//   },
//   secure: false,
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "springboottest123@gmail.com",
    pass: "spring@123",
  },
  secure: false,
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
    console.log("Email error");
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "no_reply@appname.com",
    },
    send: true,
    transport: transporter,
  });
  email
    .send({
      template: "passwordReset",
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: "Auth",
        passwordResetUrl: `http//localhost/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch((err) => {
      console.log("error sending email");
    });
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "no_reply@auth.com",
    },
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: usere.email,
      },
      locals: {
        productName: "Auth",
        name: user.name,
      },
    })
    .catch((err) => {
      console.log("error sending email for password reset");
    });
};
