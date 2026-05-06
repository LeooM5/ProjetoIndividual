var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (email == undefined) {
    res.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está indefinida!");
  } else {
    usuarioModel
      .autenticar(email, senha)
      .then(function (resultadoAutenticar) {
        if (resultadoAutenticar.length == 1) {
          res.json({
            idusuario: resultadoAutenticar[0].idusuario,
            email: resultadoAutenticar[0].email,
            nome: resultadoAutenticar[0].nome,
            termos: resultadoAutenticar[0].termos,
          });
        } else if (resultadoAutenticar.length == 0) {
          res.status(403).send("Email e/ou senha inválido(s)");
        }
      })
      .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function cadastrar(req, res) {
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;
  var termos = req.body.termosServer;

  if (nome == undefined) {
    res.status(400).send("Seu nome está undefined!");
  } else if (email == undefined) {
    res.status(400).send("Seu email está undefined!");
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está undefined!");
  } else {
    usuarioModel
      .buscarPorEmail(email)
      .then(function (resultado) {
        if (resultado.length > 0) {
          res.status(409).send("Este email já está cadastrado!");
        } else {
          usuarioModel
            .cadastrar(nome, email, senha, termos)
            .then(function (resultado) {
              res.json(resultado);
            })
            .catch(function (erro) {
              console.log(erro);
              res.status(500).json(erro.sqlMessage);
            });
        }
      })
      .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

module.exports = {
  autenticar,
  cadastrar,
};
