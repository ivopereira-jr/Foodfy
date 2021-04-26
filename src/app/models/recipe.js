const db = require('../../config/db')
const Base = require('./base')

const fs = require('fs')

Base.init({ table: 'recipes' })

module.exports = {
  ...Base,
  async all() {
    try {
      let results = await db.query(
        `
        SELECT recipes.*, chefs.name AS 
        chef_name FROM recipes LEFT JOIN 
        chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC
      `
      )

      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
  async findRecipe(id) {
    try {
      const result = await db.query(
        `
          SELECT recipes.*, chefs.name AS 
          chef_name FROM recipes LEFT JOIN 
          chefs ON (recipes.chef_id = chefs.id)
          WHERE recipes.id = $1
        `,
        [id]
      )

      return result.rows[0]
    } catch (err) {
      console.error(err)
    }
  },
  async findChefRecipes(id) {
    try {
      const result = await db.query(
        `
          SELECT recipes.*, chefs.name AS 
          chef_name FROM recipes LEFT JOIN 
          chefs ON (recipes.chef_id = chefs.id)
          WHERE chefs.id = $1
        `,
        [id]
      )

      return result.rows
    } catch (err) {
      console.error(err)
    }
  },
  async findUserRecipes(id) {
    try {
      const result = await db.query(
        `
          SELECT recipes.*, chefs.name AS 
          chef_name FROM recipes LEFT JOIN 
          chefs ON (recipes.chef_id = chefs.id)
          WHERE recipes.user_id = $1
          ORDER BY recipes.created_at DESC
        `,
        [id]
      )

      return result.rows
    } catch (err) {
      console.error(err)
    }
  },
  async paginate(params) {
    try {
      const { search, limit, offset } = params

      let query = '',
        filterQuery = '',
        totalQuery = `(
          SELECT count(*) FROM recipes
        ) AS total
        `

      if (search) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${search}%'
      `

        totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`
      }

      query = `
        SELECT recipes.*, ${totalQuery}, chefs.name 
        AS chef_name 
        FROM recipes LEFT JOIN 
        chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        ORDER BY recipes.updated_at DESC
        LIMIT $1 OFFSET $2
      `

      const results = await db.query(query, [limit, offset])

      return results.rows
    } catch (err) {
      console.error(err)
    }
  },
  async selectChef() {
    try {
      let result = await db.query('SELECT name, id FROM chefs')

      return result.rows
    } catch (err) {
      console.error(err)
    }
  }
  /*
  async delete(id) {
    try {
      let results = await db.query(
        `SELECT * FROM files 
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id )
      WHERE recipe_id = $1`,
        [id]
      )
 
      const file = results.rows[0]
 
      fs.unlinkSync(file.path)
 
      await db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id])
      await db.query(`DELETE FROM recipes WHERE recipes.id = $1`, [id])
 
      return file.file_id
    } catch (err) {
      console.error(err)
    }
  },*/
}
