const db = require("../../config/db")

module.exports = {
  create({ recipe_id, file_id }) {
    try {
      const query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
        ) VALUES ($1, $2)
        RETURNING id
        `

      const values = [recipe_id, file_id]

      return db.query(query, values)
    } catch (err) {
      console.log(err)
    }
  },
  files(id) {
    return db.query(
      `
      SELECT files.*
      FROM files 
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
      WHERE recipes.id = $1
    `,
      [id]
    )
  },
}
