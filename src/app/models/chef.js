const { date } = require("../../lib/utils")
const db = require("../../config/db")

module.exports = {
  all() {
    return db.query(`SELECT * FROM chefs`)
  },
  create(data, file_id) {
    try {
      const query = `
      INSERT INTO chefs (
        name,
        created_at,
        file_id
        ) VALUES ($1 , $2, $3)
        RETURNING id
        `

      const values = [data.name, date(Date.now()).iso, file_id]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
  find(id) {
    try {
      return db.query(
        `
      SELECT chefs.*, count(recipes) AS total_recipes 
      FROM chefs 
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
        [id]
      )
    } catch (err) {
      console.error(err)
    }
  },
  findBy(id) {
    try {
      return db.query(
        `
      SELECT * FROM recipes
      WHERE recipes.chef_id = $1
      ORDER BY recipes.created_at DESC
      `,
        [id]
      )
    } catch (err) {
      console.error(err)
    }
  },
  update(data, file_id) {
    try {
      const query = `
        UPDATE chefs SET 
        name=($1),
        file_id=($2)
        WHERE id = $3
      `

      const values = [data.name, file_id, data.id]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE from chefs WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
  createFile(data) {
    try {
      const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `

      const values = [data.filename, data.path]

      return db.query(query, values)
    } catch (err) {
      console.log(err)
    }
  },
}
