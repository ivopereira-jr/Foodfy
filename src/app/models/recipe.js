const { date } = require('../../lib/utils')
const db = require('../../config/db')
const { off } = require('../../config/db')

module.exports = {
  all(callback) {
    db.query(`SELECT recipes.*, chefs.name AS 
    chef_name FROM recipes LEFT JOIN 
    chefs ON (recipes.chef_id = chefs.id)`, function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })

  },
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        image,
        chef_id,
        title,
        ingredients,
        steps,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    
    const values = [
      data.image,
      data.chef_id,
      data.title,
      data.ingredients,
      data.steps,
      data.information,
      date(Date.now()).iso
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })

  },
  find(id, callback) {
    db.query(`SELECT recipes.*, chefs.name AS 
    chef_name FROM recipes LEFT JOIN 
    chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.id = $1`, [id], function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })

  },
  findBy(filter, callback) {
    db.query(`SELECT recipes.*, chefs.name AS 
    chef_name FROM recipes LEFT JOIN 
    chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    `, function(err, results) {
        if(err) throw `Database error! ${err}`

        callback(results.rows)
    })

  },
  update(data, callback) {
    const query = `
      UPDATE recipes SET 
      image=($1),
      chef_id=($2),
      title=($3),
      ingredients=($4),
      steps=($5),
      information=($6)
      WHERE id = $7
    `

    const values = [
      data.image,
      data.chef_id,
      data.title,
      data.ingredients,
      data.steps,
      data.information,
      data.id
    ]

    db.query(query, values, function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback()
    })

  },
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
      if(err) throw `Database Error! ${err}`

      return callback()
    })

  },
  chefsSelectOptions(callback) {
    db.query(`SELECT name, id FROM chefs`, function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },
  totalRecipes(callback) {
    db.query(`SELECT chefs.*, count(recipes) AS 
    total_recipes FROM chefs LEFT JOIN recipes
    ON (chefs.id = recipes.chef_id) GROUP BY
    chefs.id ORDER BY total_recipes DESC`, function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
    
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = "",
        filterQuery = "",
        totalQuery = `(
          SELECT count(*) FROM recipes
        ) AS total
        `
    
    if(filter) {
      filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`

    } 
    
    query = `
      SELECT recipes.*, ${totalQuery}, chefs.name 
      AS chef_name 
      FROM recipes LEFT JOIN 
      chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], function(err, results) {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  }

}