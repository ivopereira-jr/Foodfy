const Recipe = require('../models/recipe')
const File = require('../models/file')
const RecipeFiles = require('../models/recipeFiles')
const User = require('../models/User')

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
  async index(req, res) {
    try {
      const user = await User.find(req.session.userId)

      const recipes = await LoadRecipeService.load('userRecipes', user.id)

      return res.render('admin/recipes/index', { user, recipes })
    } catch (err) {
      console.log(err)
    }
  },
  async create(req, res) {
    const chefOptions = await Recipe.selectChef()

    return res.render('admin/recipes/create', { chefOptions })
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (key of keys) {
        if (req.body[key] == '') {
          return res.render('admin/recipes/create', {
            recipe: req.body,
            error: 'Por favor Preencha todos os campos.'
          })
        }
      }

      if (req.files.length == 0) {
        return res.render('admin/recipes/create', {
          recipe: req.body,
          error: 'Por favor envie pelo menos uma imagem.'
        })
      }

      req.body.user_id = req.session.userId

      const recipeId = await Recipe.create(req.body)

      const filesPromise = req.files.map(file =>
        File.create({ name: file.filename, path: file.path })
      )

      const filesId = await Promise.all(filesPromise)

      for (let i = 0; i < filesId.length; i++) {
        RecipeFiles.create({ recipe_id: recipeId, file_id: filesId[i] })
      }

      return res.render('admin/recipes/create', {
        success: 'Receita criada com secesso.',
        location: '/admin/recipes'
      })
    } catch (err) {
      console.log(err)
      return res.render('admin/recipes/create', {
        error: 'Alguma coisa deu errado! Tente novamente.',
        recipe: req.body
      })
    }
  },
  async show(req, res) {
    const recipe = await LoadRecipeService.load('recipe', req.params.id)

    if (!recipe) return res.render('recipes/404')

    return res.render('admin/recipes/receita', { recipe })
  },
  async edit(req, res) {
    const recipe = await LoadRecipeService.load('recipe', req.params.id)
    const chefOptions = await Recipe.selectChef()

    return res.render('admin/recipes/edit', {
      recipe,
      chefOptions
    })
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)
      const chefOptions = await Recipe.selectChef()

      for (key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          return res.render('admin/recipes/edit', {
            error: 'Por favor Preencha todos os campos.',
            recipe: req.body,
            chefOptions
          })
        }
      }

      if (req.files.length == 0) {
        return res.render('admin/recipes/create', {
          error: 'Por favor envie pelo menos uma imagem.',
          recipe: req.body,
          chefOptions
        })
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => File.create({ ...file }))

        const filesResults = await Promise.all(newFilesPromise)

        const recipeFiles = filesResults.map(file =>
          RecipeFiles.create({
            file_id: file.rows[0].id,
            recipe_id: req.body.id
          })
        )

        await Promise.all(recipeFiles)
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        const removedRecipeFilesIdPromise = removedFiles.map(id =>
          RecipeFiles.removedFiles(id)
        )
        /* const removedFilesPromise = removedFiles.map(id => File.delete(id)) */

        await Promise.all(removedRecipeFilesIdPromise)
      }

      await Recipe.update(req.body)

      return res.render('admin/recipes/edit', {
        success: 'Receita atualizada com sucesso.',
        location: `/admin/recipes/${req.body.id}`
      })
    } catch (err) {
      console.log(err)
      return res.render('admin/recipes/edit', {
        error: 'Alguma coisa deu errada! Tente novamente.',
        recipe: req.body,
        chefOptions
      })
    }
  },
  async delete(req, res) {
    let fileDelete = await Recipe.delete(req.body.id)

    await File.delete(fileDelete)

    return res.redirect('/admin/recipes')
  }
}
