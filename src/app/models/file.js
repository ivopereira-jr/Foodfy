const db = require("../../config/db")
const Base = require('./base')

const fs = require("fs")

Base.init({ table: "files" })

module.exports = {
  ...Base,
  /*
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
  }, */
}
