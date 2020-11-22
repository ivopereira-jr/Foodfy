const express = require("express") //para utilizar o express
const nunjucks = require("nunjucks") //para utilizar o nunjucks
const routes = require("./routes")
const methodOverride = require("method-override") //para o put e o delete dos form
const session = require("./config/session")

const server = express() //para o server

server.use(session)
server.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
server.use(express.urlencoded({ extended: true })) //para habilitar o req.body
server.use(express.static("public")) //para acessar os arquivos que estao na public como css js images etc
server.use(methodOverride("_method"))
server.use(routes)

server.set("view engine", "njk") //akie e para utilizar o nunjucks para exibir os arquivos no navegador

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true,
})

server.listen(5000, function () {
  console.log("server ok")
})
