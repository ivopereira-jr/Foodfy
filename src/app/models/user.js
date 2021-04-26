const db = require("../../config/db")
const { hash } = require("bcryptjs")
const Base = require('./base')

Base.init({ table: "users" })

module.exports = {
  ...Base,
  /* find(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id])
  },
  findOne(filter) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [filter])
  }, 
  async create(data, password) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
      `
      const passwordHash = await hash(password, 8)

      const values = [data.name, data.email, passwordHash, data.is_admin]

      let results = await db.query(query, values)

      return results.rows[0].id
    } catch (err) {
      console.error(err)
    }
  },*/

}
