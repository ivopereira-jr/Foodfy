const User = require("../models/User")

module.exports = {
  async index(req, res) {
    let result = await User.find(req.session.userId)
    const user = result.rows[0]

    return res.render("admin/profile/index", { user })
  },
  async put(req, res) {
    try {
      await User.update(req.body)

      return res.render("admin/profile/index", {
        user: req.body,
        success: "Conta atualizada com sucesso!",
      })
    } catch (err) {
      console.log(err)
      return res.render("admin/profile/index", {
        user: req.body,
        error: "Xii deu alguma coisa errada! Tente novamente.",
      })
    }
  },
}
