// sessão
function validarSessao() {
  let email = sessionStorage.EMAIL_USUARIO;
  let nome = sessionStorage.NOME_USUARIO;

  let b_usuario = document.getElementById("nome_usuario");
  let paragrafo = document.getElementById("paragrafo-ao-logar");
  let linkLogin = document.getElementById("link-login");
  let cadastroNoIndex = document.getElementById("sumirAposLogin");

  if (email != null && nome != null) {
    b_usuario.innerHTML = `${nome.split(" ")[0]}!`;
    paragrafo.style.display = "inline-block";
    linkLogin.style.display = "none";
    sair.style.display = "inline-block";
    cadastroNoIndex.style.display = "none";
  }
}

function validarSessaoDash() {
  let email = sessionStorage.EMAIL_USUARIO;
  let nome = sessionStorage.NOME_USUARIO;

  let b_usuario = document.getElementById("nome_usuario");

  if (email != null && nome != null) {
    b_usuario.innerHTML = `${nome.split(" ")[0]}!`;
  } else {
    window.location = "./login.html";
  }
}

function limparSessao() {
  sessionStorage.clear();
  window.location = "./index.html";
}
