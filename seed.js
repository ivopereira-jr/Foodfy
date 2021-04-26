const faker = require("faker")
const { hash } = require("bcryptjs")

const User = require("./src/app/models/user")
const Chef = require("./src/app/models/chef")
const File = require("./src/app/models/file")
const Recipe = require("./src/app/models/recipe")
const RecipeFiles = require("./src/app/models/recipeFiles")

let usersIds = [],
  chefsIds = [],
  totalUsers = 3,
  totalChefs = 6,
  totalRecipes = 6

// criação dos usuarios  
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

// criação das imanges tanto dos chefs quanto das receitas
async function createFiles(placeholder, totalFiles) {
  let files = []

  while (files.length < totalFiles) {
    files.push({
      name: faker.image.image(),
      path: `/images/${placeholder}`,
    })
  }

  const filesPromise = files.map(file => File.create(file))

  filesIds = await Promise.all(filesPromise)

  return filesIds
}

// criação dos chefs
async function createChefs() {
  const chefs = []

  const filesIds = await createFiles('chefs/placeholderChef.jpg', totalChefs)

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: filesIds[Math.floor(Math.random() * totalChefs)],
    })
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef))

  chefsIds = await Promise.all(chefsPromise)
}

// criação das receitas
async function createRecipes() {
  const recipes = []

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      title: faker.name.title(),
      ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 3)).split(" "),
      steps: faker.lorem.paragraph(Math.ceil(Math.random() * 3)).split(" "),
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
    })
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
  const recipesIds = await Promise.all(recipesPromise)

  const filesIds = await createFiles('recipes/placeholder.jpg', totalRecipes)

  for (let i = 0; i < recipes.length; i++) {
    RecipeFiles.create({
      recipe_id: recipesIds[i],
      file_id: filesIds[i]
    })
  }
}


async function init() {
  await createUsers()
  await createChefs()
  await createRecipes()
}

init()
