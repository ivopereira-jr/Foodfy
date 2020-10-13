const Chef = require("../models/chef")
const File = require("../models/file")
const RecipeFiles = require("../models/recipe-files")

module.exports = {
  async index(req, res) {
    let results = await Chef.all()
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

    return res.render("admin/chefs/index", { chefs, chef: allFiles })
  },
  create(req, res) {
    return res.render("admin/chefs/create")
  },
  async post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      //akie e para validaçao dos campos de input nao ficarem vazios
      if (req.body[key] == "") return res.send("please, fill all")
    }

    if (req.files.length == 0)
      return res.send("Por favor envie pelo menos uma imagem")

    const filesPromise = req.files.map(file => File.create({ ...file }))
    let file = await filesPromise[0]
    const fileId = file.rows[0].id

    let results = await Chef.create(req.body, fileId)
    const chefId = results.rows[0].id

    return res.redirect(`/admin/chefs/${chefId}/edit`)
  },
  async show(req, res) {
    let results = await Chef.find(req.params.id)
    const chefInfo = results.rows[0]

    if (!chefInfo) return res.render("recipes/404")

    results = await File.chefFile(chefInfo.id)
    const chefImg = results.rows.map(
      file =>
        `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`
    )

    const recipes = await Chef.findBy(chefInfo.id)

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

    const recipesPromises = recipes.rows.map(async recipe => {
      recipe.img = await getImage(recipe.id)
      return recipe
    })

    const allFiles = await Promise.all(recipesPromises)

    return res.render("admin/chefs/chef", {
      chefImg,
      chefInfo,
      recipes: allFiles,
    })
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id)
    const chef = results.rows[0]

    if (!chef) return res.render("recipes/404")

    let file = await File.chefFile(chef.id)
    const chefImg = file.rows.map(
      file =>
        `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`
    )

    return res.render("admin/chefs/edit", { chef, chefImg })
  },
  async put(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == "") return res.send("please, fill all")
    }

    let fileId
    let fileIdDelete

    if (req.files.length != 0) {
      let file = await File.chefFile(req.body.id)
      fileIdDelete = file.rows[0].file_id

      const newFilesPromise = req.files.map(file => File.create({ ...file }))

      let results = await newFilesPromise[0]
      fileId = results.rows[0].id
    }

    await Chef.update(req.body, fileId)

    if (fileIdDelete != fileId) {
      File.deleteFileChef(fileIdDelete)
    }

    return res.redirect(`/admin/chefs/${req.body.id}`)
  },
  async delete(req, res) {
    // acha o chef e o total de receitas dele
    let result = await Chef.find(req.body.id)
    const chef = result.rows[0]

    // faz a verificação para saber se o chef tem ou não receitas
    if (chef.total_recipes >= 1) {
      // retorna a mensagem de erro informando que chefs com receitas não podem ser deletados
      return res.render("admin/chefs/404", { chef })
    } else {
      // caso não tenha receita, pode deletar o chef
      await Chef.delete(req.body.id)

      return res.redirect("/admin/chefs")
    }
  },
}
