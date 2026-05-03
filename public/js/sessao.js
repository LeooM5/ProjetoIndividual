// sessão
function validarSessao() {
  var email = sessionStorage.EMAIL_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;

  var b_usuario = document.getElementById("nome_usuario");
  var paragrafo = document.getElementById("paragrafo-ao-logar");
  var linkLogin = document.getElementById("link-login");

  if (email != null && nome != null) {
    b_usuario.innerHTML = `${nome.split(" ")[0]}!`;
    paragrafo.style.display = "inline-block";
    linkLogin.style.display = "none";
    sair.style.display = "inline-block";
  }
}

function validarSessaoDash() {
  var email = sessionStorage.EMAIL_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;

  var b_usuario = document.getElementById("nome_usuario");

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
