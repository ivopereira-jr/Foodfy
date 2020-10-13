const db = require("../../config/db")
const fs = require("fs")

module.exports = {
  create({ filename, path }) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [filename, path]

    return db.query(query, values)
  },
  async delete(id) {
    try {
      const results = await db.query(
        `SELECT * FROM files 
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id )
      WHERE files.id = $1`,
        [id]
      )
      const file = results.rows[0]

      fs.unlinkSync(file.path)

      await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])

      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
  chefFile(id) {
    return db.query(
      `
      SELECT * FROM files 
      LEFT JOIN chefs ON (files.id = chefs.file_id )
      WHERE chefs.id = $1
    `,
      [id]
    )
  },
  async deleteFileChef(id) {
    try {
      const results = await db.query(
        `SELECT * FROM files 
      LEFT JOIN chefs ON (files.id = chefs.file_id )
      WHERE files.id = $1`,
        [id]
      )
      const file = results.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
}
