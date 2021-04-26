const fs = require('fs')
const db = require('../../config/db')

const Base = require('./base')

Base.init({ table: 'recipe_files' })

module.exports = {
  ...Base,
  async files(id) {
    let results = await db.query(
      `
        SELECT files.*
        FROM files 
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
        WHERE recipes.id = $1
      `,
      [id]
    )

    return results.rows
  },
  async removedFiles(id) {
    try {
      let results = await db.query('SELECT * FROM files WHERE id = $1', [id])

      const file = results.rows[0]

      fs.unlinkSync(file.path)

      await db.query('DELETE FROM recipe_files WHERE file_id = $1', [id])
      await db.query('DELETE FROM files WHERE files.id = $1', [id])

      return file.file_id
    } catch (err) {
      console.error(err)
    }
  }
}
