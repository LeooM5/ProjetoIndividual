var database = require("../database/config");

async function registrar(
  data,
  chutes,
  penaltis,
  gols,
  golsPenalti,
  tipo,
  usuario,
) {
  try {
    var instrucaoPartida = `
      INSERT INTO partida (dataPartida, tipoPartida)
      VALUES ('${data}', '${tipo}');
    `;

    var resultadoPartida = await database.executar(instrucaoPartida);

    var idPartida = resultadoPartida.insertId;

    var instrucaoEstatistica = `
      INSERT INTO estatistica (
        chutesRecebidos,
        penaltisPartida,
        golsSofridos,
        golsPenalti,
        fkUsuario,
        fkPartida
      )
      VALUES (
        ${chutes},
        ${penaltis},
        ${gols},
        ${golsPenalti},
        ${usuario},
        ${idPartida}
      );
    `;

    return await database.executar(instrucaoEstatistica);
  } catch (erro) {
    console.log(erro);
    throw erro;
  }
}

function buscarDashboard(idUsuario) {
  var instrucaoSql = `
    SELECT
      p.dataPartida,
      e.golsSofridos,
      p.tipoPartida
    FROM estatistica e
    JOIN partida p
      ON e.fkPartida = p.idPartida
    WHERE e.fkUsuario = ${idUsuario}
    ORDER BY p.dataPartida;
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
  registrar,
  buscarDashboard,
};
