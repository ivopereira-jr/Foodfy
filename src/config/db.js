const { Pool } = require("pg")

module.exports = new Pool ({
  user: "postgres",
  password: "45782818",
  host: "localhost",
  port: 5432,
  database: "foodfy"

})