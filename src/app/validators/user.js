const User = require('../models/User')
const Recipe = require('../models/recipe')

function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect('/login')

  next()
}

async function isAdmin(req, res, next) {
  const user = await User.find(req.session.userId)

  if (!user.is_admin == true) {
    return res.render('admin-layout', {
      error: 'Acesso negado! somente administradores.',
      location: '/admin/recipes'
    })
  }

  next()
}

async function userRecipe(req, res, next) {
  const userId = req.session.userId
  const user = await User.find(userId)

  const recipe = await Recipe.find(req.params.id)

  if (!user.is_admin == true && userId != recipe.user_id) {
    return res.render('admin-layout', {
      error: 'você pode editar apenas suas receitas.',
      location: '/admin/recipes'
    })
  }

  next()
}

module.exports = {
  onlyUsers,
  isAdmin,
  userRecipe
}
