const Recipe = require("../models/recipe")
const File = require("../models/file")
const RecipeFiles = require("../models/recipeFiles")
const User = require("../models/User")

module.exports = {
  async index(req, res) {
    const userId = req.session.userId

    let results = await User.find(userId)
    const user = results.rows[0]
    let recipes

    try {
      if (user) {
        if (user.is_admin != true) {
          let results = await Recipe.recipesFromUser(user.id)
          recipes = results.rows
        } else {
          let results = await Recipe.all()
          recipes = results.rows
        }
      }

      if (recipes) {
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

        return res.render("admin/recipes/index", { user, recipes: allSet })
      } else {
        return res.render("admin/recipes/index")
      }
    } catch (err) {
      console.log(err)
    }
  },
  async create(req, res) {
    let result = await Recipe.chefsSelectOptions()
    const chefOptions = result.rows

    return res.render("admin/recipes/create", { chefOptions })
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (key of keys) {
        if (req.body[key] == "") {
          return res.render("admin/recipes/create", {
            recipe: req.body,
            error: "Por favor Preencha todos os campos.",
          })
        }
      }

      if (req.files.length == 0) {
        return res.render("admin/recipes/create", {
          recipe: req.body,
          error: "Por favor envie pelo menos uma imagem.",
        })
      }

      req.body.user_id = req.session.userId

      let results = await Recipe.create(req.body)
      const recipeId = results.rows[0].id

      const filesPromise = req.files.map(file => File.create({ ...file }))

      const filesResults = await Promise.all(filesPromise) // akie espera o array de promesas

      const recipeFiles = filesResults.map(result =>
        RecipeFiles.create({ file_id: result.rows[0].id, recipe_id: recipeId })
      )

      await Promise.all(recipeFiles)

      return res.render("admin/recipes/create", {
        success: "Receita criada com secesso.",
        location: "/admin/recipes",
      })
    } catch (err) {
      console.log(err)
      return res.render("admin/recipes/create", {
        recipe: req.body,
        error: "Alguma coisa deu errado! Tente novamente.",
      })
    }
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.render("recipes/404")

    results = await RecipeFiles.files(recipe.id)
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render("admin/recipes/receita", { recipe, files })
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.render("recipes/404")

    results = await RecipeFiles.files(recipe.id)
    let files = results.rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    let chefName = await Recipe.chefsSelectOptions()
    const chefOptions = chefName.rows

    return res.render("admin/recipes/edit", {
      recipe,
      chefOptions,
      files,
    })
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
          return res.render("admin/recipes/edit", {
            recipe: req.body,
            error: "Por favor Preencha todos os campos.",
          })
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => File.create({ ...file }))

        const filesResults = await Promise.all(newFilesPromise)

        const recipeFiles = filesResults.map(file =>
          RecipeFiles.create({
            file_id: file.rows[0].id,
            recipe_id: req.body.id,
          })
        )

        await Promise.all(recipeFiles)
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        const removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
      }

      await Recipe.update(req.body)

      return res.render("admin/recipes/edit", {
        success: "Receita atualizada com sucesso.",
        location: `/admin/recipes/${req.body.id}`,
      })
    } catch (err) {
      console.log(err)
      return res.render("admin/recipes/edit", {
        recipe: req.body,
        error: "Alguma coisa deu errada! Tente novamente.",
      })
    }
  },
  async delete(req, res) {
    let fileDelete = await Recipe.delete(req.body.id)

    await File.delete(fileDelete)

    return res.redirect("/admin/recipes")
  },
}
