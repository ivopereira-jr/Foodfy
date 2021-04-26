const express = require('express')
const routes = express.Router()

const Foodfy = require('../app/controllers/foodfyController')
const Login = require('./login')
const Admin = require('./admin')

routes.use('/login', Login)
routes.use('/admin', Admin)

// foodfy
routes
  .get('/', function (req, res) {
    return res.redirect('/inicio')
  })
  .get('/inicio', Foodfy.index)
  .get('/sobre', Foodfy.sobre)
  .get('/receitas', Foodfy.receitas)
  .get('/receita/:id', Foodfy.receita)
  .get('/chefs', Foodfy.chefs)
  .get('/chefs/:id', Foodfy.chefDetail)

module.exports = routes
