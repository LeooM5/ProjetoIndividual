let graficoPizza;
let graficoGolsSofridos;

function iniciarDashboard() {
  validarSessaoDash();
  carregarGraficos();
}

function iniciarTabelaHistorico() {
  validarSessaoDash();
  carregarTabela();
}

function registrarPartida() {
  if (
    datePartida.value != "" &&
    chutesPartida.value != "" &&
    penaltisPartida.value != "" &&
    golsPartida.value != "" &&
    penaltisPercebido.value != "" &&
    typePartida.value != ""
  ) {
    fetch("/partidas/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataServer: datePartida.value,
        chutesServer: chutesPartida.value,
        penaltisServer: penaltisPartida.value,
        golsServer: golsPartida.value,
        golsPenaltiServer: penaltisPercebido.value,
        tipoServer: typePartida.value,
        usuarioServer: sessionStorage.ID_USUARIO,
      }),
    })
      .then((resposta) => {
        if (resposta.ok) {
          location.reload();
        }
      })
      .catch((erro) => console.log(erro));

    return false;
  }
  alert("Insira dados válidos");
}

function carregarGraficos() {
  const idUsuario = sessionStorage.ID_USUARIO;

  fetch(`/partidas/cards/${idUsuario}`)
    .then((res) => res.json())
    .then((dados) => atualizarCards(dados));

  fetch(`/partidas/dashboard/${idUsuario}`)
    .then((res) => res.json())
    .then((dados) => {
      plotarGraficos(dados);
      preencherTabela(dados);
    });
}

function carregarTabela() {
  const idUsuario = sessionStorage.ID_USUARIO;

  fetch(`/partidas/dashboard/${idUsuario}`)
    .then((res) => res.json())
    .then((dados) => {
      preencherTabelaCompleta(dados);
    });
}

function atualizarCards(dados) {
  if (!dados || dados.length === 0) {
    document.getElementById("b_partidas").innerText = 0;
    document.getElementById("b_chutesTotais").innerText = 0;
    document.getElementById("b_golSofridos").innerText = 0;
    document.getElementById("b_porcentagemDefesa").innerText = "0%";
    return;
  }

  const totalPartidas = dados[0].totalPartidas > 0 ? dados[0].totalPartidas : 0;

  if (totalPartidas == 0) {
    document.getElementById("box-metricas-partida").style.display = "none";
    document.getElementById("tabela-historico").style.display = "none";
  } else {
    document.getElementById("box-metricas-partida").style.display = "flex";
    document.getElementById("tabela-historico").style.display = "flex";
  }

  const totalGols =
    dados[0].totalGolsSofridos > 0 ? dados[0].totalGolsSofridos : 0;
  const totalChutes =
    dados[0].totalChutesRecebidos > 0 ? dados[0].totalChutesRecebidos : 0;

  const savesRatio =
    totalChutes > 0
      ? (((totalChutes - totalGols) / totalChutes) * 100).toFixed(1)
      : 0;

  document.getElementById("b_partidas").innerText = totalPartidas;
  document.getElementById("b_chutesTotais").innerText = totalChutes;
  document.getElementById("b_golSofridos").innerText = totalGols;
  document.getElementById("b_porcentagemDefesa").innerText = `${savesRatio}%`;

  let cor = "#2196f3";
  let status = "Ótimo";
  let estado = "excelent";

  if (savesRatio < 80) {
    estado = "bad";
    status = "Ruim";
    cor = "#ff4d4d";
  } else if (savesRatio <= 95) {
    estado = "good";
    status = "Bom";
    cor = "#4caf50";
  }

  document.getElementById("b_porcentagemDefesa").style.color = cor;
  document.getElementById("b_status").style.color = cor;
  document.getElementById("box5").style.boxShadow = `1px 2px 20px 2px ${cor}`;
  document.getElementById("b_status").innerHTML =
    `${status} <span class="bolinha-${estado}"></span>`;
}

function plotarGraficos(dados) {
  const labels = dados.map((d) =>
    new Date(d.dataPartida).toLocaleDateString("pt-BR"),
  );

  const gols = dados.map((d) => d.golsSofridos);
  const defesas = dados.map((d) => d.chutesRecebidos - d.golsSofridos);

  const federado = dados.filter((d) => d.tipoPartida === "Federado").length;

  const naoFederado = dados.filter(
    (d) => d.tipoPartida === "Não Federado",
  ).length;

  const totalPartidas = federado + naoFederado;

  const porcentagemFederado = `${((federado / totalPartidas) * 100).toFixed(2)}`;

  const porcentagemNaoFederado = `${((naoFederado / totalPartidas) * 100).toFixed(2)}`;

  const ctx = document.getElementById("line").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 350);

  gradient.addColorStop(0, "rgba(194, 65, 12, 0.85)");
  gradient.addColorStop(0.35, "rgba(194, 65, 12, 0.45)");
  gradient.addColorStop(1, "rgba(194, 65, 12, 0)");

  graficoLinha = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Defesas",
          data: defesas,
          tension: 0.5,
          fill: true,
          backgroundColor: gradient,
          borderColor: "#c2410c",
          borderWidth: 2,
          pointBackgroundColor: "#eda082",
          pointBorderColor: "#ed9876",
          pointRadius: 4,
          pointHoverRadius: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: false,
        },
      },
    },
  });

  graficoPizza = new Chart(document.getElementById("pizza"), {
    type: "doughnut",
    data: {
      labels: ["Federado", "Não Federado"],
      datasets: [
        {
          data: [porcentagemFederado, porcentagemNaoFederado],
          backgroundColor: ["#9c2f03", "#f8bda6"],
          borderWidth: 2,
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let partidas = [federado, naoFederado];

              return `${context.raw}% (${partidas[context.dataIndex]} partidas)`;
            },
          },
        },
      },

      maintainAspectRatio: false,
    },
  });

  graficoGolsSofridos = new Chart(document.getElementById("barGolsSofridos"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Gols Sofridos",
          data: gols,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#d27854",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: false,
        },
      },
    },
  });
}

function preencherTabelaCompleta(dados) {
  const tbody = document.getElementById("tabela-historico-completa");

  tbody.innerHTML = "";

  const ordenados = [...dados];

  console.log(ordenados);

  ordenados.forEach((partida) => {
    let status = "ÓTIMO";

    if (partida.golsSofridos >= 4) {
      status = "RUIM";
    } else if (partida.golsSofridos >= 1) {
      status = "BOM";
    }

    let cor = ``;

    if (status == "RUIM") {
      cor = `#ff4d4d`;
    } else if (status == "BOM") {
      cor = `#4caf50`;
    } else {
      cor = `#2196f3`;
    }

    tbody.innerHTML += `
      <tr>
        <td>${new Date(partida.dataPartida).toLocaleDateString("pt-BR")}</td>
        <td>${partida.golsSofridos}</td>
        <td>${partida.penaltisPartida}</td>
        <td>${partida.golsPenalti}</td>
        <td>${partida.tipoPartida}</td>
        <td><span style="background-color: ${cor}">${status}</span></td>
      </tr>
    `;
  });
}

function preencherTabela(dados) {
  const tbody = document.getElementById("tbodyHistorico");

  tbody.innerHTML = "";

  const ordenados = [...dados].slice(0, 5);

  ordenados.forEach((partida) => {
    let status = "ÓTIMO";

    if (partida.golsSofridos >= 4) {
      status = "RUIM";
    } else if (partida.golsSofridos >= 1) {
      status = "BOM";
    }

    let cor = ``;

    if (status == "RUIM") {
      cor = `#ff4d4d`;
    } else if (status == "BOM") {
      cor = `#4caf50`;
    } else {
      cor = `#2196f3`;
    }

    tbody.innerHTML += `
      <tr>
        <td>${new Date(partida.dataPartida).toLocaleDateString("pt-BR")}</td>
        <td>${partida.golsSofridos}</td>
        <td>${partida.tipoPartida}</td>
        <td><span style="background-color: ${cor}">${status}</span></td>
      </tr>
    `;
  });
}

function irAoHistoricoDePartida() {
  window.location = "./historicoDePartida.html";
}

function irADash() {
  window.location = "./dashboard.html";
}
