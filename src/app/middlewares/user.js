const User = require('../models/user')
const { compare } = require('bcryptjs')

async function post(req, res, next) {
  try {
    let { email } = req.body

    let results = await User.findOne(email)
    const user = results.rows[0]

    if (user) {
      return res.render('admin/users/create', {
        user: req.body,
        error: 'Este email já está em uso! Tente outro.'
      })
    }

    next()
  } catch (err) {
    console.error(err)
  }
}

async function put(req, res, next) {
  try {
    const { id, password } = req.body

    let results = await User.find(id)
    const user = results.rows[0]

    const passwordPassed = await compare(password, user.password)

    if (!passwordPassed)
      return res.render('admin/profile/index', {
        user: req.body,
        error: 'Senha incorreta.'
      })

    req.user = user

    next()
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  post,
  put
}
