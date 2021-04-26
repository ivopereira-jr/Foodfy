const User = require('../models/User')

const { compare } = require('bcryptjs')

async function login(req, res, next) {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.render('session/login', {
      user: req.body,
      error: 'Esse email não esta cadastrado!'
    })
  }

  const passwordPassed = await compare(password, user.password)

  if (!passwordPassed) {
    return res.render('session/login', {
      user: req.body,
      error: 'Senha incorreta!'
    })
  }

  req.user = user

  next()
}

async function forgot(req, res, next) {
  try {
    const { email } = req.body
    const user = await User.findOne(email)

    if (!user) {
      return res.render('session/login', {
        user: req.body,
        error: 'Usuário não esta cadastrado!'
      })
    }

    req.user = user

    next()
  } catch (err) {
    console.error(err)
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  let results = await User.findOne(email)
  const user = results.rows[0]

  if (!user) {
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Usuário não esta cadastrado!'
    })
  }

  if (password != passwordRepeat)
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'A confirmação de senha esta diferente da senha.'
    })

  if (token != user.reset_token)
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })

  let now = new Date()
  now = now.setHours(now.getHours())

  if (now > user.reset_token_expires)
    return res.render('session/password-reset', {
      user: req.body,
      token,
      error:
        'Token expirado! Por favor, socilicite uma nova recuperação de senha.'
    })

  req.user = user

  next()
}

module.exports = {
  login,
  forgot,
  reset
}
