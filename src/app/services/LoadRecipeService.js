const Recipe = require('../models/recipe')
const RecipeFiles = require('../models/recipeFiles')

async function getImages(recipeId) {
  let files = await RecipeFiles.files(recipeId)
  files = files.map(file => ({
    ...file,
    src: `${file.path.replace('public', '')}`
  }))

  return files
}

async function format(recipe) {
  const files = await getImages(recipe.id)
  recipe.img = files[0].src
  recipe.files = files

  return recipe
}

const LoadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },
  async recipe() {
    try {
      const recipe = await Recipe.findRecipe(this.filter)

      return format(recipe)
    } catch (err) {
      console.error(err)
    }
  },
  async recipes() {
    try {
      const recipes = await Recipe.all(this.filter)
      const recipesPromise = recipes.map(format)

      return Promise.all(recipesPromise)
    } catch (err) {
      console.error(err)
    }
  },
  async recipesPagination() {
    try {
      const recipes = await Recipe.paginate(this.filter)
      const recipesPromise = recipes.map(format)

      return Promise.all(recipesPromise)
    } catch (err) {
      console.error(err)
    }
  },
  async chefRecipes() {
    try {
      const recipes = await Recipe.findChefRecipes(this.filter)
      const recipesPromise = recipes.map(format)

      return Promise.all(recipesPromise)
    } catch (err) {
      console.error(err)
    }
  },
  async userRecipes() {
    try {
      const recipes = await Recipe.findUserRecipes(this.filter)
      const recipesPromise = recipes.map(format)

      return Promise.all(recipesPromise)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = LoadService
