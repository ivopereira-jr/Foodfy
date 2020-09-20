const adminChef = require("../models/chef")

module.exports = {
  index(req, res) {
    adminChef.all(function(chefs) {
      return res.render("admin/chefs/index", {chefs})
    })
   },
   create(req, res) {
      return res.render("admin/chefs/create")
   },
   post(req, res) {   
      const keys = Object.keys(req.body)

      for(key of keys) {
        //akie e para validaçao dos campos de input nao ficarem vazios
        if(req.body[key] == "")
          return res.send('please, fill all')
      }
      
      adminChef.create(req.body, function(chef) {
        return res.redirect(`/admin/chefs/${chef.id}`)
      })


   },
   show(req, res) {
      adminChef.find(req.params.id, function(chef) {
         if(!chef) {
            return res.render("recipes/404")
         }

         adminChef.findBy(chef.id, function(recipes){

            return res.render("admin/chefs/chef", {chef, recipes})  
         })

      })

   },
   edit(req, res) {
      adminChef.find(req.params.id, function(chef) {
         if(!chef) return res.render("recipes/404")
         
         return res.render("admin/chefs/edit", {chef})
      })

   },
   put(req, res) {
      const keys = Object.keys(req.body)

      for(key of keys) {
         if(req.body[key] == "")
          return res.send('please, fill all')
      }
         
      adminChef.update(req.body, function() {
         return res.redirect(`/admin/chefs/${req.body.id}`)
      })  
      
   },
   delete(req, res) {
      // acha o chef e o total de receitas dele
      adminChef.find(req.body.id, function (chef) {
      // faz a verificação para saber se o chef tem ou não receitas
         if (chef.total_recipes >= 1) {
            // retorna a mensagem de erro informando que chefs com receitas não podem ser deletados
            return res.render('admin/chefs/404', {chef})

         } else {
      // caso não tenha receita, pode deletar o chef
            adminChef.delete(req.body.id, function() {
            // retorna fazendo o redirect para a pagina que lista os chefs, por exemplo
             return res.redirect('/admin/chefs')
            })
         }

      })
            
   }

}