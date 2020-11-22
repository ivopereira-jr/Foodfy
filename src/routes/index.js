const express = require("express")
const routes = express.Router()

const recipes = require("../app/controllers/recipesController")
const login = require("./login")
const admin = require("./admin")

routes.use("/login", login)
routes.use("/admin", admin)

// recipes
routes.get("/", function (req, res) {
  return res.redirect("/inicio")
})
routes.get("/inicio", recipes.index)
routes.get("/sobre", recipes.sobre)
routes.get("/receitas", recipes.receitas)
routes.get("/receita/:id", recipes.receita)
routes.get("/chefs", recipes.chefs)
routes.get("/chefs/:id", recipes.chefDetail)
routes.get("/receitas/resultado", recipes.results)

module.exports = routes
