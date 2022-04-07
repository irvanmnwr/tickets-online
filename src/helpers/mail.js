const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const mustache = require("mustache");

const clientId =
  "375012269271-nnp7tttqjocqmbnu2a6bbom6g8e2o7p3.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//047WJNWMgESMkCgYIARAAGAQSNwF-L9IrqKQ1vuFmIoDre_Kr8fV2vX13VjLfXybOBkiIk6oiVgsC9kMpEfoDznpspew2mPMSJp8";

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

module.exports = {
  sendMail: (data) =>
    new Promise((resolve, reject) => {
      const accessToken = OAuth2Client.getAccessToken();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "irvanmnwr@gmail.com",
          clientId,
          clientSecret,
          refreshToken,
          accessToken,
        },
      });

      const fileTemplate = fs.readFileSync(
        `src/templates/email/${data.template}`,
        "utf8"
      );

      const mailOptions = {
        from: '"ticket-online" <irvanmnwr@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: mustache.render(fileTemplate, { ...data }),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
      transporter.close();
    }),
};
