const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if (results.error) Validate.displayError(input, results.error)
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error")
    if (errorDiv) {
      errorDiv.remove()
      input.classList.remove("invalid")
    }
  },
  displayError(input, error) {
    const div = document.createElement("div")
    div.classList.add("error")
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.classList.add("invalid")
    input.focus() //para manter no input
  },
  isName(value) {
    let error = null

    const nameFormat = /[A-Z][a-z]* [A-Z][a-z]*/

    if (!value.match(nameFormat)) error = "Nome inválido"

    return {
      error,
      value,
    }
  },
  isEmail(value) {
    let error = null

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!value.match(mailFormat)) error = "E-mail inválido"

    return {
      error,
      value,
    }
  },
}
