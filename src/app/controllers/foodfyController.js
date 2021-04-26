const { getParams } = require('../../lib/utils')

const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipeService.load('recipes')

      return res.render('foodfy/index', { recipes })
    } catch (err) {
      console.error(err)
    }
  },
  sobre(req, res) {
    return res.render('foodfy/about')
  },
  async receitas(req, res) {
    try {
      const params = getParams(req.query, 6)
      const recipes = await LoadRecipeService.load('recipesPagination', params)
      const pagination = { page: params.page }

      recipes.length == 0
        ? (pagination.total = 1)
        : (pagination.total = Math.ceil(recipes[0].total / params.limit))

      if (params.search) {
        return res.render('recipes/search-results', {
          recipes,
          search: params.search,
          pagination
        })
      }

      if (!recipes) {
        return res.send('Recipes not found')
      }

      return res.render('recipes/index', {
        recipes,
        pagination
      })
    } catch (err) {
      console.error(err)
    }
  },
  async receita(req, res) {
    try {
      const recipe = await LoadRecipeService.load('recipe', req.params.id)

      if (!recipe) {
        return res.render('404')
      }

      return res.render('recipes/recipe-detail', { recipe })
    } catch (err) {
      console.error(err)
    }
  },
  async chefs(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs')

      return res.render('chefs/index', { chefs })
    } catch (err) {
      console.error(err)
    }
  },
  async chefDetail(req, res) {
    try {
      const chef = await LoadChefService.load('chef', req.params.id)
      const recipes = await LoadRecipeService.load('chefRecipes', chef.id)

      return res.render('chefs/chef-detail', {
        chef,
        recipes
      })
    } catch (err) {
      console.error(err)
    }
  }
}
