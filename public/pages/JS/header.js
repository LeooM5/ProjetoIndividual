window.addEventListener("scroll", function () {
  let cabecalho = document.getElementsByClassName("cabecalho")[0];
  if (window.scrollY > 1) {
    cabecalho.classList.remove("transparente");
  } else {
    cabecalho.classList.add("transparente");
  }
});
 