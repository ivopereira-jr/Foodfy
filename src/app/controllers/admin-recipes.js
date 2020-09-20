const adminRecipe = require('../models/recipe')

module.exports = {
   index(req, res) {
      adminRecipe.all(function(recipes) {
         return res.render("admin/recipes/index", {recipes})
      
      })

   },
   create(req, res) {
      adminRecipe.chefsSelectOptions(function(options) {
         return res.render("admin/recipes/create", {chefOptions: options})
      })
   },
   post(req, res) {   
      const keys = Object.keys(req.body)

      for(key of keys) {
         //akie e validaçao dos campos de input se ficarem vazios pd retorna um pg d erro so escolhe 
         if(req.body[key] == "")
            return res.send('please, fill all')
      }
      
      adminRecipe.create(req.body, function(recipe) {
         return res.redirect(`/admin/recipes/${recipe.id}`)
      })


   },
   show(req, res) {
      adminRecipe.find(req.params.id, function(recipe) {
         if(!recipe) return res.render("recipes/404")
         
         return res.render("admin/recipes/receita", {recipe})
      })

   },
   edit(req, res) {
      adminRecipe.find(req.params.id, function(recipe) {
         if(!recipe) return res.render("recipes/404")
         
         adminRecipe.chefsSelectOptions(function(options) {
            return res.render("admin/recipes/edit", {recipe, chefOptions: options })
         })

      })

   },
   put(req, res) {
      const keys = Object.keys(req.body)

      for(key of keys) {
         if(req.body[key] == "")
          return res.send('please, fill all')
      }
         
      adminRecipe.update(req.body, function() {
         return res.redirect(`/admin/recipes/${req.body.id}`)
      })  
      
   },
   delete(req, res) {
      adminRecipe.delete(req.body.id, function() {
         return res.redirect('/admin/recipes')
      })
            
   }

}