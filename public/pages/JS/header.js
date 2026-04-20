window.addEventListener("scroll", function () {
  let cabecalho = document.querySelector(".cabecalho");
  if (window.scrollY > 1) {
    cabecalho.classList.remove("transparente");
  } else {
    cabecalho.classList.add("transparente");
  }
});
