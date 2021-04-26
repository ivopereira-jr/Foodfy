const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/sessionController')
const SessionValidator = require('../app/validators/session')

// login/logout
routes.get('/', SessionController.loginForm)

routes.post('/', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

//reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)

routes.post(
  '/forgot-password',
  SessionValidator.forgot,
  SessionController.forgot
)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

module.exports = routes
