const db = require("../../config/db")
const { hash } = require("bcryptjs")

module.exports = {
  listUsers() {
    return db.query(`SELECT * FROM users`)
  },
  find(id) {
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
  },
  update(data) {
    try {
      const query = `
        UPDATE users SET
          name=($1),
          email=($2)
        WHERE id = $3  
      `

      const values = [data.name, data.email, data.id]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
  delete(id) {
    return db.query(`DELETE FROM users WHERE id = $1`, [id])
  },
  adminUpdate(data) {
    try {
      const query = `
        UPDATE users SET
          name=($1),
          email=($2),
          is_admin=($3)
        WHERE id = $4  
      `

      const values = [data.name, data.email, data.is_admin, data.id]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
}
