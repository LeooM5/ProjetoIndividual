var express = require("express");
var router = express.Router();

var partidaController = require("../controllers/partidaController");

router.post("/registrar", function (req, res) {
  partidaController.registrar(req, res);
});

router.get("/dashboard/:idUsuario", function (req, res) {
  partidaController.buscarDashboard(req, res);
});

router.get("/cards/:idUsuario", function (req, res) {
  partidaController.cards(req, res);
});

module.exports = router;
