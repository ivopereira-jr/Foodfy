const db = require("../../config/db")
const fs = require("fs")

module.exports = {
  all() {
    return db.query(
      `
        SELECT recipes.*, chefs.name AS 
        chef_name FROM recipes LEFT JOIN 
        chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC
      `
    )
  },

  create(data) {
    try {
      const query = `
        INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          steps,
          information,
          user_id
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.steps,
        data.information,
        data.user_id,
      ]

      return db.query(query, values)
    } catch (err) {
      console.log(err)
    }
  },
  update(data) {
    try {
      const query = `
        UPDATE recipes SET 
        chef_id=($1),
        title=($2),
        ingredients=($3),
        steps=($4),
        information=($5)
        WHERE id = $6
      `

      const values = [
        data.chef_id,
        data.title,
        data.ingredients,
        data.steps,
        data.information,
        data.id,
      ]

      return db.query(query, values)
    } catch (err) {
      console.log(err)
    }
  },
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
  },
  find(id) {
    try {
      return db.query(
        `
          SELECT recipes.*, chefs.name AS 
          chef_name FROM recipes LEFT JOIN 
          chefs ON (recipes.chef_id = chefs.id)
          WHERE recipes.id = $1
        `,
        [id]
      )
    } catch (err) {
      console.error(err)
    }
  },
  findOne(id) {
    return db.query(`SELECT * FROM recipes WHERE id = $1`, [id])
  },
  userRecipes(id) {
    return db.query(`SELECT * FROM recipes WHERE user_id = $1`, [id])
  },
  recipesFromUser(id) {
    return db.query(
      `
        SELECT recipes.*, chefs.name AS 
        chef_name FROM recipes LEFT JOIN 
        chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.user_id = $1
        ORDER BY recipes.created_at DESC
      `,
      [id]
    )
  },
  chefsSelectOptions() {
    try {
      return db.query(`SELECT name, id FROM chefs`)
    } catch (err) {
      console.error(err)
    }
  },
  totalRecipes() {
    try {
      return db.query(
        `
          SELECT chefs.*, count(recipes) AS 
          total_recipes FROM chefs LEFT JOIN recipes
          ON (chefs.id = recipes.chef_id) GROUP BY
          chefs.id ORDER BY total_recipes DESC
        `
      )
    } catch (err) {
      console.error(err)
    }
  },
  paginate(params) {
    try {
      const { filter, limit, offset } = params

      let query = "",
        filterQuery = "",
        totalQuery = `(
          SELECT count(*) FROM recipes
        ) AS total
        `

      if (filter) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
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

      return db.query(query, [limit, offset])
    } catch (err) {
      console.error(err)
    }
  },
}
