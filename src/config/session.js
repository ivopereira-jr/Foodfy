//configuraçao da sessao
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const db = require("./db")

module.exports = session({
  store: new pgSession({
    pool: db,
  }),
  secret: "iabadabaduu" /* chave secreta para sessao */,
  resave: false /* com isso ele vai salva somente uma vez sem isso sempre que tiver reload vai ficar salvando */,
  saveUninitialized: false /* aki e para nao salvar se nao tiver dados */,
  cookie: {
    //tempo que a sesao vai ficar salva no banco de dados
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
})
