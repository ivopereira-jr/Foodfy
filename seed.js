const faker = require("faker")
const { hash } = require("bcryptjs")

const User = require("./src/app/models/user")
const Chef = require("./src/app/models/chef")
const File = require("./src/app/models/file")
const Recipe = require("./src/app/models/recipe")
const Base = require("./src/app/models/base")

let usersIds = []
let totalUsers = 4
let totalChefs = 4
let totalRecipes = 4
let totalFiles = totalChefs + totalRecipes

async function createUsers() {
  const users = []
  const password = await hash("3333", 8)

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: faker.random.boolean(),
    })
  }

  const usersPromise = users.map(user => User.create(user))
  usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
  const chefs = []

  for (let i = 1; chefs.length < totalChefs; i++) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: i,
    })
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef, chef.file_id))
  chefsIds = await Promise.all(chefsPromise)
}

async function createFiles() {
  let files = []

  while (files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `/images/placeholder.png`,
    })
  }

  const filesPromise = files.map(file => File.create(file))

  filesIds = await Promise.all(filesPromise)
}

async function createRecipes() {
  let recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: Math.ceil(Math.random() * 3),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.name.title(),
      ingredients: faker.lorem
        .paragraph(Math.ceil(Math.random() * 1))
        .split(" "),
      preparation: faker.lorem
        .paragraph(Math.ceil(Math.random() * 1))
        .split(" "),
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
    })
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
  recipesIds = await Promise.all(recipesPromise)
}

async function createPivotTableRelations() {
  const relations = []
  let recipesCount = 0

  for (let i = totalChefs + 1; relations.length < totalRecipes; i++) {
    recipesCount++

    relations.push({
      recipe_id: recipesCount,
      file_id: i,
    })
  }

  const relationsPromises = relations.map(relation => {
    Base.init({
      table: "recipe_files",
    })

    Base.create(relation)
  })

  await Promise.all(relationsPromises)
}

async function init() {
  await createUsers()
  await createChefs()
  await createFiles()
  await createRecipes()
  await createPivotTableRelations()
}

init()
