const express = require("express")
const routes = express.Router()
const recipes = require("./app/controllers/recipes")
const adminRecipes = require("./app/controllers/admin-recipes")
const adminChefs = require("./app/controllers/admin-chefs")
const recipeMulter = require("./app/middlewares/recipe-multer")
const chefMulter = require("./app/middlewares/chef-multer")

// recipes
routes.get("/", function (req, res) {
  return res.redirect("/inicio")
})
routes.get("/inicio", recipes.index)
routes.get("/sobre", recipes.sobre)
routes.get("/receitas", recipes.receitas)
routes.get("/receita/:id", recipes.receita)
routes.get("/chefs", recipes.chefs)
routes.get("/receitas/resultado", recipes.results)

//admin recipes
routes.get("/admin/recipes", adminRecipes.index)
routes.get("/admin/recipes/create", adminRecipes.create)
routes.get("/admin/recipes/:id", adminRecipes.show)
routes.get("/admin/recipes/:id/edit", adminRecipes.edit)

routes.post(
  "/admin/recipes",
  recipeMulter.array("photos", 5),
  adminRecipes.post
) //o nome depois do multer.array tem que ser igual ao name que esta no input de files
routes.put("/admin/recipes", recipeMulter.array("photos", 5), adminRecipes.put)
routes.delete("/admin/recipes", adminRecipes.delete)

//admin chefs
routes.get("/admin/chefs", adminChefs.index)
routes.get("/admin/chefs/create", adminChefs.create)
routes.get("/admin/chefs/:id", adminChefs.show)
routes.get("/admin/chefs/:id/edit", adminChefs.edit)

routes.post("/admin/chefs", chefMulter.array("photo", 1), adminChefs.post)
routes.put("/admin/chefs", chefMulter.array("photo", 1), adminChefs.put)
routes.delete("/admin/chefs", adminChefs.delete)

module.exports = routes //para exportar
