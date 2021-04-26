const express = require('express')
const routes = express.Router()

const recipeMulter = require('../app/middlewares/recipeMulter')
const chefMulter = require('../app/middlewares/chefMulter')
const User = require('../app/middlewares/user')

const { onlyUsers, userRecipe, isAdmin } = require('../app/validators/user')

const adminRecipes = require('../app/controllers/adminRecipesController')
const adminChefs = require('../app/controllers/adminChefsController')
const adminUsers = require('../app/controllers/adminUsersController')
const ProfileController = require('../app/controllers/profileController')

// admin recipes
routes
  .get('/recipes', onlyUsers, adminRecipes.index)
  .get('/recipes/create', onlyUsers, adminRecipes.create)
  .get('/recipes/:id', onlyUsers, adminRecipes.show)
  .get('/recipes/:id/edit', onlyUsers, userRecipe, adminRecipes.edit)

  .post('/recipes', recipeMulter.array('photos', 5), adminRecipes.post)
  .put('/recipes', recipeMulter.array('photos', 5), adminRecipes.put)
  .delete('/recipes', adminRecipes.delete)

  // admin chefs
  .get('/chefs', onlyUsers, adminChefs.index)
  .get('/chefs/create', onlyUsers, isAdmin, adminChefs.create)
  .get('/chefs/:id', onlyUsers, adminChefs.chefDetail)
  .get('/chefs/:id/edit', onlyUsers, isAdmin, adminChefs.edit)

  .post('/chefs', chefMulter.array('photo', 1), adminChefs.post)
  .put('/chefs', chefMulter.array('photo', 1), adminChefs.put)
  .delete('/chefs', adminChefs.delete)

  // admin users
  .get('/profile', onlyUsers, ProfileController.index)
  .put('/profile', User.put, ProfileController.put)

  // gerenciar usuários
  .get('/users', onlyUsers, isAdmin, adminUsers.list)
  .get('/users/create', onlyUsers, isAdmin, adminUsers.create)
  .get('/users/:id/edit', onlyUsers, isAdmin, adminUsers.edit)

  .post('/users/create', User.post, adminUsers.post)
  .put('/users', adminUsers.update)
  .delete('/users', adminUsers.delete)

module.exports = routes
