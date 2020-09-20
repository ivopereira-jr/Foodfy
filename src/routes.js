const express = require('express')
const routes = express.Router()
const recipes = require('./app/controllers/recipes')
const adminRecipes = require('./app/controllers/admin-recipes')
const adminChefs = require('./app/controllers/admin-chefs')


// recipes
routes.get("/", function(req, res) {
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

routes.post("/admin/recipes", adminRecipes.post)
routes.put("/admin/recipes", adminRecipes.put)
routes.delete("/admin/recipes", adminRecipes.delete)

//admin chefs 
routes.get("/admin/chefs", adminChefs.index)
routes.get("/admin/chefs/create", adminChefs.create)
routes.get("/admin/chefs/:id", adminChefs.show) 
routes.get("/admin/chefs/:id/edit", adminChefs.edit)

routes.post("/admin/chefs", adminChefs.post)
routes.put("/admin/chefs", adminChefs.put)
routes.delete("/admin/chefs", adminChefs.delete)

module.exports = routes//para exportar