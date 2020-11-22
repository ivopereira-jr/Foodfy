const express = require("express")
const routes = express.Router()

const adminRecipes = require("../app/controllers/adminRecipesController")
const adminChefs = require("../app/controllers/adminChefsController")
const adminUsers = require("../app/controllers/adminUsersController")
const ProfileController = require("../app/controllers/profileController")

const recipeMulter = require("../app/middlewares/recipeMulter")
const chefMulter = require("../app/middlewares/chefMulter")
const Users = require("../app/middlewares/user")
const { onlyUsers } = require("../app/middlewares/user")

const { userRecipe, isAdmin } = require("../app/validators/user")

// admin recipes
routes.get("/recipes", onlyUsers, adminRecipes.index)
routes.get("/recipes/create", onlyUsers, adminRecipes.create)
routes.get("/recipes/:id", onlyUsers, adminRecipes.show)
routes.get("/recipes/:id/edit", onlyUsers, userRecipe, adminRecipes.edit)

routes.post("/recipes", recipeMulter.array("photos", 5), adminRecipes.post)
routes.put("/recipes", recipeMulter.array("photos", 5), adminRecipes.put)
routes.delete("/recipes", adminRecipes.delete)

// admin chefs
routes.get("/chefs", onlyUsers, adminChefs.index)
routes.get("/chefs/create", onlyUsers, isAdmin, adminChefs.create)
routes.get("/chefs/:id", onlyUsers, adminChefs.show)
routes.get("/chefs/:id/edit", onlyUsers, isAdmin, adminChefs.edit)

routes.post("/chefs", chefMulter.array("photo", 1), adminChefs.post)
routes.put("/chefs", chefMulter.array("photo", 1), adminChefs.put)
routes.delete("/chefs", adminChefs.delete)

// admin users
routes.get("/profile", onlyUsers, ProfileController.index)
routes.put("/profile", Users.put, ProfileController.put)

// gerenciar usuários
routes.get("/users", onlyUsers, isAdmin, adminUsers.list)
routes.get("/users/create", onlyUsers, isAdmin, adminUsers.create)
routes.get("/users/:id/edit", onlyUsers, isAdmin, adminUsers.edit)

routes.post("/users/create", Users.post, adminUsers.post)
routes.put("/users", adminUsers.update)
routes.delete("/users", adminUsers.delete)

module.exports = routes
