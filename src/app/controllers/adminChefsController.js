const Chef = require('../models/chef')
const File = require('../models/file')

const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
  async index(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs')

      return res.render('admin/chefs/index', { chefs })
    } catch (err) {
      console.error(err)
    }
  },
  create(req, res) {
    return res.render('admin/chefs/create')
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (let key of keys) {
        if (req.body[key] == '') {
          return res.render('admin/chefs/create', {
            chef: req.body,
            error: 'Por favor Preencha todos os campos.',
          })
        }
      }

      if (req.files.length == 0) {
        return res.render('admin/chefs/create', {
          chef: req.body,
          error: 'Por favor envie pelo menos uma imagem.',
        })
      }

      const filesPromise = req.files.map(file => File.create({ ...file }))

      let results = await Promise.all(filesPromise)
      let fileId = results.map(result => result.rows[0].id)

      await Chef.create(req.body, fileId[0])

      return res.render('admin/chefs/create', {
        success: 'Chef cadastrado com secesso!',
        location: '/admin/chefs',
      })
    } catch (err) {
      console.log(err)
      return res.render('admin/chefs/create', {
        chef: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.',
      })
    }
  },
  async chefDetail(req, res) {
    try {
      const chef = await LoadChefService.load('chef', req.params.id)
      const recipes = await LoadRecipeService.load('chefRecipes', chef.id)

      return res.render('admin/chefs/chef', {
        chef,
        recipes,
      })

    } catch (err) {
      console.error(err)
    }
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id)
    const chef = results.rows[0]

    if (!chef) return res.render('recipes/404')

    let file = await File.chefFile(chef.id)
    const chefImg = file.rows.map(
      file =>
        `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          ''
        )}`
    )

    return res.render('admin/chefs/edit', { chef, chefImg })
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (let key of keys) {
        if (req.body[key] == '') {
          return res.render('admin/chefs/edit', {
            chef: req.body,
            error: 'Por favor Preencha todos os campos.',
          })
        }
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

      return res.render('admin/chefs/edit', {
        success: 'Chef Atualizado com secesso!',
        location: '/admin/chefs',
      })
    } catch (err) {
      console.log(err)
      return res.render('admin/chefs/edit', {
        chef: req.body,
        error: 'Alguma coisa deu errado! Tente novamente.',
      })
    }
  },
  async delete(req, res) {
    let result = await Chef.find(req.body.id)
    const chef = result.rows[0]

    if (chef.total_recipes >= 1) {
      return res.render('admin/chefs/404', { chef })
    } else {
      await Chef.delete(req.body.id)

      return res.redirect('/admin/chefs')
    }
  },
}
