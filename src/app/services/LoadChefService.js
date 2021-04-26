const Chef = require('../models/chef')

async function format(chef) {
  chef.file = await Chef.file(chef.id)
  chef.file.src = `${chef.file.path.replace('public', '')}`

  return chef
}

const LoadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },
  async chef() {
    try {
      const chef = await Chef.findChef(this.filter)

      return format(chef)
    } catch (error) {
      console.error(error)
    }
  },
  async chefs() {
    try {
      const chefs = await Chef.findAll(this.filter)
      const chefsPromise = chefs.map(format)

      return Promise.all(chefsPromise)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = LoadService
