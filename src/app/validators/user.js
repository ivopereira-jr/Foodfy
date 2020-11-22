const User = require("../models/User")
const Recipe = require("../models/recipe")

async function isAdmin(req, res, next) {
  let result = await User.find(req.session.userId)
  const userResult = result.rows[0]

  if (!userResult.is_admin == true) {
    return res.render("admin-layout", {
      error: "Acesso negado! somente administradores.",
      location: "/admin/recipes",
    })
  }

  next()
}

async function userRecipe(req, res, next) {
  const userId = req.session.userId

  let userResults = await User.find(userId)
  const user = userResults.rows[0]

  let recipesResults = await Recipe.findOne(req.params.id)
  const userIdRecipe = recipesResults.rows[0].user_id

  if (!user.is_admin == true && userId != userIdRecipe) {
    return res.render("admin-layout", {
      error: "você pode editar apenas suas receitas.",
      location: "/admin/recipes",
    })
  }

  next()
}

module.exports = {
  isAdmin,
  userRecipe,
}
