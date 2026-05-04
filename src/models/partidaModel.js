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

function buscarCards(idUsuario) {
  return database.executar(`
    SELECT
      COUNT(*) AS totalPartidas,
      SUM(e.golsSofridos) AS totalGolsSofridos,
      SUM(e.chutesRecebidos) AS totalChutesRecebidos
    FROM estatistica e
    WHERE e.fkUsuario = ${idUsuario}
  `);
}

function buscarDashboard(idUsuario) {
  return database.executar(`
    SELECT
      p.dataPartida,
      p.tipoPartida,
      e.golsSofridos,
      e.chutesRecebidos
    FROM estatistica e
    JOIN partida p ON e.fkPartida = p.idPartida
    WHERE e.fkUsuario = ${idUsuario}
    ORDER BY p.dataPartida ASC
  `);
}

module.exports = {
  registrar,
  buscarDashboard,
  buscarCards,
};
