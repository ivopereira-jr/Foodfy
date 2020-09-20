//para verificar a pagina que esta sendo acessada e ativar o link da pagina
const activePage = location.pathname //para pegar a pagina que esta sendo acessada
const navLinks = document.querySelectorAll("header .links a")

for(item of navLinks) {
   if(activePage.includes(item.getAttribute("href"))) {
      item.classList.add("link-active")
   }
}

window.onscroll = function() {
   let navbar = document.querySelector("header");
   navbar.classList.toggle("stick", window.scrollY > 20)

   let topBtn = document.querySelector(".topbtn");
   topBtn.classList.toggle("active", window.scrollY > 120)
   
}

//para subir para o top d pagina
$(document).ready(function() {
   $('.topbtn').click(function() {
      $('html, body').animate({scrollTop: 0}, 400)
   })
})


// para os cards das receitas
const cards = document.querySelectorAll(".card")

cards.forEach(card => card.addEventListener("click", function() {
   const receitaId = card.getAttribute("id")
   window.location.href = `/receita/${receitaId}`
  
}))


//mostar ou esconder info da receita
const openCloce = document.querySelectorAll(".receita-wraper a")

openCloce.forEach(a => a.addEventListener("click", function() {
  const info = a.parentElement.nextElementSibling
  info.classList.toggle('close')    
  
  if(a.innerHTML == 'Esconder') {
    a.innerHTML = 'Mostrar'
  } else {
    a.innerHTML = 'Esconder'
  } 
  
}))

//funcao para verificar se a pessoa quer mesmo deleter quando clicar no botao
document.querySelector("#form-delete").addEventListener("submit", function(event){
   const confirmation = confirm("Deseja Deletar?")
   if(!confirmation) {
      event.preventDefault()
   }

})