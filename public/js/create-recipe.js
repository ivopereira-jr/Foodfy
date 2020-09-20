//adionar mais ingredientes
document
   .querySelector(".add-ingredient")
   .addEventListener("click", addIngredient);

function addIngredient() {
   const ingredients = document.querySelector(".ingredients");
   const fieldContainer = document.querySelectorAll(".ingredient");

   // Realiza um clone do último ingrediente adicionado
   const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
   
   // Não adiciona um novo input se o último tem um valor vazio
   if (newField.children[0].value == "") return false;

   // Deixa o valor do input vazio
   newField.children[0].value = "";
   ingredients.appendChild(newField);

}

//adionar mais passos do modo de preparo
document
   .querySelector(".add-step")
   .addEventListener("click", addStep)

function addStep() {
   const steps = document.querySelector(".steps")
   const fieldContainer = document.querySelectorAll(".step")

   const newFiled = fieldContainer[fieldContainer.length - 1].cloneNode(true)

   if(newFiled.children[0].value == "") return false

   newFiled.children[0].value = ""
   steps.appendChild(newFiled)

}