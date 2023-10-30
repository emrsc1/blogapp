const nodemailer=require('nodemailer');
const config=require("../config");
var transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    from:config.email.from,
    user: config.email.username,
    pass: config.email.password,
  },
});
module.exports=transporter;