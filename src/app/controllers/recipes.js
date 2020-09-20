const adminRecipe = require('../models/recipe')

module.exports = {
   index(req, res) {
      adminRecipe.all(function(recipes) { 
         return res.render("recipes/index", {recipes})
      })
   },
   sobre(req, res) {
      return res.render("recipes/sobre")
   },
   receitas(req, res) {
      let { filter, page, limit } = req.query

      page = page || 1
      limit = limit || 4
      let offset = limit * (page - 1)

      const params = {
         page,
         limit,
         offset,
         callback(recipes) {
            const pagination = {
               total: Math.ceil(recipes[0].total / limit),
               page
            }//math.ceil e para fazer o calculo e arredonda para cima assim nao fica um numero quebrado e sobra uma pagina com o elemento ou elementos restantes

            return res.render("recipes/receitas", {recipes, pagination, filter})
         }

      }
 
      adminRecipe.paginate(params)
      
   },
   receita(req, res) {
      adminRecipe.find(req.params.id, function(recipe) {
         if(!recipe) {
            return res.render("404")
         }

         return res.render("recipes/receita", {recipe})
      })

   },
   chefs(req, res) {
      adminRecipe.totalRecipes(function(chefs) {
         return res.render("recipes/chefs", {chefs})
      })
   },
   results(req, res) {
      
      let { filter, page, limit } = req.query

      page = page || 1
      limit = limit || 4
      let offset = limit * (page - 1)

      const params = {
         filter,
         page,
         limit,
         offset,
         callback(recipes) {
            const pagination = {
               total: Math.ceil(recipes[0].total / limit),
               page
            }//math.ceil e para fazer o calculo e arredonda para cima assim nao fica um numero quebrado e sobra uma pagina com o elemento ou elementos restantes

            return res.render("recipes/resultado", {recipes, pagination, filter})
         }

      }
 
      adminRecipe.paginate(params)

   }

}
