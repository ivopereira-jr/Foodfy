const Recipe = require("../models/recipe")
const File = require("../models/file")
const RecipeFiles = require("../models/recipe-files")

module.exports = {
  async index(req, res) {
    let results = await Recipe.all()
    const recipes = results.rows

    async function getImage(recipeId) {
      let result = await RecipeFiles.files(recipeId)
      const files = result.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      )

      return files[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    })

    const allSet = await Promise.all(recipesPromise)

    return res.render("recipes/index", { recipes: allSet })
  },
  sobre(req, res) {
    return res.render("recipes/sobre")
  },
  async receitas(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 4
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
    }

    let results = await Recipe.paginate(params)
    let recipes = results.rows

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit) //math.ceil e para fazer o calculo e arredonda para cima assim nao fica um numero quebrado e sobra uma pagina com o elemento ou elementos restantes

    const pagination = {
      total: mathTotal,
      page,
    }

    if (!recipes) {
      return res.send("Recipes not found")
    }

    async function getImage(recipeId) {
      let results = await RecipeFiles.files(recipeId)
      const files = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      )

      return files[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    })

    const allSet = await Promise.all(recipesPromise)

    return res.render("recipes/receitas", {
      recipes: allSet,
      pagination,
      filter,
    })
  },
  async receita(req, res) {
    let result = await Recipe.find(req.params.id)
    const recipe = result.rows[0]

    if (!recipe) {
      return res.render("recipes/404")
    }

    results = await RecipeFiles.files(recipe.id)
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render("recipes/receita", { recipe, files })
  },
  async chefs(req, res) {
    let results = await Recipe.totalRecipes()
    const chefs = results.rows

    async function getImage(chefId) {
      let results = await File.chefFile(chefId)
      const files = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      )

      return files[0]
    }

    const chefsPromises = chefs.map(async chef => {
      chef.img = await getImage(chef.id)
      return chef
    })

    const allFiles = await Promise.all(chefsPromises)

    return res.render("recipes/chefs", { chefs: allFiles })
  },
  async results(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 4
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
    }

    let results = await Recipe.resultsPaginate(params)
    let recipes = results.rows

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit)

    const pagination = {
      total: mathTotal,
      page,
    }

    if (!recipes) {
      return res.send("Recipes not found")
    }

    async function getImage(recipeId) {
      let results = await RecipeFiles.files(recipeId)
      const files = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      )

      return files[0]
    }

    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    })

    const allSet = await Promise.all(recipesPromise)

    return res.render("recipes/resultado", {
      recipes: allSet,
      pagination,
      filter,
    })
  },
}
