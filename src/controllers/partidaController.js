var partidaModel = require("../models/partidaModel");

function registrar(req, res) {
  var data = req.body.dataServer;
  var chutes = req.body.chutesServer;
  var penaltis = req.body.penaltisServer;
  var gols = req.body.golsServer;
  var golsPenalti = req.body.golsPenaltiServer;
  var tipo = req.body.tipoServer;
  var usuario = req.body.usuarioServer;

  if (data == undefined) {
    res.status(400).send("Data undefined");
  } else {
    partidaModel
      .registrar(data, chutes, penaltis, gols, golsPenalti, tipo, usuario)
      .then(function (resultado) {
        res.json(resultado);
      })
      .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
      });
  }
}

function buscarDashboard(req, res) {
  var idUsuario = req.params.idUsuario;

  partidaModel
    .buscarDashboard(idUsuario)
    .then(function (resultado) {
      res.json(resultado);
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
  registrar,
  buscarDashboard,
};
