const User = require("../models/user")
const { compare } = require("bcryptjs")

function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect("/login")

  next()
}

async function post(req, res, next) {
  let { email } = req.body

  let results = await User.findOne(email)
  const user = results.rows[0]

  if (user) {
    return res.render("admin/users/create", {
      user: req.body,
      error: "Este email já está em uso! Tente outro.",
    })
  }

  next()
}

async function put(req, res, next) {
  const { id, password } = req.body

  let results = await User.find(id)
  const user = results.rows[0]

  const passwordPassed = await compare(password, user.password)

  if (!passwordPassed)
    return res.render("admin/profile/index", {
      user: req.body,
      error: "Senha incorreta.",
    })

  req.user = user

  next()
}

module.exports = {
  onlyUsers,
  post,
  put,
}
