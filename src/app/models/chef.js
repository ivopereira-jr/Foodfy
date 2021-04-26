const db = require('../../config/db')
const Base = require('./base')

const { date } = require('../../lib/utils')

Base.init({ table: 'chefs' })

module.exports = {
  ...Base,
  async findChef(id) {
    try {
      const results = await db.query(
        `
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
        `,
        [id]
      )

      return results.rows[0]
    } catch (err) {
      console.error(err)
    }
  },
  async file(id) {
    try {
      const result = await db.query(
        `
          SELECT * FROM files 
          LEFT JOIN chefs ON (files.id = chefs.file_id )
          WHERE chefs.id = $1
        `,
        [id]
      )

      return result.rows[0]
    } catch (err) {
      console.error(err)
    }
  }
}
