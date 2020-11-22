const crypto = require("crypto")
const mailer = require("../../lib/mailer")

const User = require("../models/user")
const Recipe = require("../models/recipe")
const File = require("../models/file")

module.exports = {
  async list(req, res) {
    let results = await User.listUsers()
    const users = results.rows

    return res.render("admin/users/index", { users })
  },
  create(req, res) {
    return res.render("admin/users/create")
  },
  async post(req, res) {
    const password = crypto.randomBytes(8).toString("hex")

    await mailer.sendMail({
      to: req.body.email, //para onde enviar o email
      from: "no-reply@foodfy.com.br", //da ond esta send enviado,
      subject: "Senha de acesso ao foodfy", //titulo
      html: `
      <h2>Olaa seja bem vindo(a)</h2>
      <p>Aqui esta sua senha para realizar o acesso ao foodfy.
      ${password}      
      </p>
    `, //corpo do email
    })

    let userId = await User.create(req.body, password)

    if (!req.session.userId) req.session.userId = userId

    return res.render("admin/users/create", {
      success: "Usuário cadastrado com secesso!",
      location: "/admin/users",
    })
  },
  async edit(req, res) {
    let result = await User.find(req.params.id)
    const user = result.rows[0]

    return res.render("admin/users/edit", { user })
  },
  async update(req, res) {
    try {
      await User.adminUpdate(req.body)

      return res.redirect("/admin/users")
    } catch (err) {
      console.error(err)
    }
  },
  async delete(req, res) {
    try {
      let result = await User.find(req.body.id)
      const user = result.rows[0]

      if (user.is_admin == true) {
        return res.render("admin/users/edit", {
          user,
          error: "Você não pode deletar sua conta.",
        })
      } else {
        let userId = req.body.id

        let results = await Recipe.userRecipes(userId)
        let userRecipes = results.rows

        for (let recipe of userRecipes) {
          const fileDelete = await Recipe.delete(recipe.id)
          await File.delete(fileDelete)
        }

        await User.delete(userId)
      }

      return res.render("admin/users/edit", {
        success: "Usuário deletado com sucesso!",
        location: "/admin/users",
      })
    } catch (err) {
      console.log(err)
      return res.render("admin/users/edit", {
        user: req.body,
        error: "Alguma coisa deu errado! Tente novamente",
      })
    }
  },
}
