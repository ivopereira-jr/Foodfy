const db = require("../../config/db")
const fs = require("fs")

module.exports = {
  create(data) {
    try {
      const query = `
        INSERT INTO files (
          name,
          path
          ) VALUES ($1, $2)
          RETURNING id
      `

      const values = [data.name, data.path]

      return db.query(query, values)
    } catch (err) {
      console.log(err)
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
        `
          SELECT * FROM files 
          LEFT JOIN chefs ON (files.id = chefs.file_id )
          WHERE files.id = $1
        `,
        [id]
      )
      const file = results.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
  async delete(id) {
    try {
      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
}
