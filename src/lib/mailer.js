const nodemailer = require("nodemailer")

//entrar no mailtrap para pegar esse codigo
module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "da7214f3ae7a14",
    pass: "0ec76fec0b7ce2",
  },
})
