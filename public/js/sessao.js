// sessão
function validarSessao() {
  var email = sessionStorage.EMAIL_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;

  var b_usuario = document.getElementById("nome_usuario");
  var paragrafo = document.getElementById("paragrafo-ao-logar");
  var linkLogin = document.getElementById("link-login");

  if (email != null && nome != null) {
    var finalDoPrimeiroNome = nome.indexOf(" ");
    b_usuario.innerHTML = `${nome.substring(0, finalDoPrimeiroNome)}!`;
    paragrafo.style.display = "inline-block";
    linkLogin.style.display = "none";
  }
}

function limparSessao() {
  sessionStorage.clear();
  window.location = "./pages/login.html";
}
