const User = require("../models/User")
const mailer = require("../../lib/mailer")

const crypto = require("crypto")
const { hash } = require("bcryptjs")

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    req.session.userId = req.user.id

    return res.redirect("/admin/recipes")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const user = req.user

    try {
      const token = crypto.randomBytes(20).toString("hex")

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      })

      await mailer.sendMail({
        to: user.email, //para onde enviar o email
        from: "no-reply@foody.com.br", //da ond esta send enviado,
        subject: "Recuperação de senha", //titulo
        html: `
        <h2>Não consegue entrar?</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
        <p>
          <a href="http://localhost:3000/login/password-reset?token=${token}" target="_blank">
            Recuperar senha
          </a>
        </p>
      `,
      })

      return res.render("session/forgot-password", {
        success: "Verifique seu email para resetar sua senha.",
        location: "/login",
      })
    } catch (err) {
      console.error(err)
      return res.render("session/forgot-password", {
        user,
        error: "Alguma coisa errada não esta certa, tente novamente!",
      })
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", {
      token: req.query.token,
    })
  },
  async reset(req, res) {
    const user = req.user
    const { password, token } = req.body

    try {
      const newPasssword = await hash(password, 8)

      await User.update(user.id, {
        password: newPasssword,
        reset_token: "",
        reset_token_expires: "",
      })

      return res.render("session/login", {
        user: req.body,
        success: "Senha atualizada! Faça o seu login",
      })
    } catch (err) {
      console.error(err)
      return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "Alguma coisa errada não esta certa, Tente novamente.",
      })
    }
  },
}
