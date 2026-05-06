let graficoLinha;
let graficoPizza;
let graficoGolsSofridos;

function iniciarDashboard() {
  validarSessaoDash();
  carregarGraficos();
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

function atualizarCards(dados) {
  if (!dados || dados.length === 0) {
    document.getElementById("b_partidas").innerText = 0;
    document.getElementById("b_chutesTotais").innerText = 0;
    document.getElementById("b_golSofridos").innerText = 0;
    document.getElementById("b_porcentagemDefesa").innerText = "0%";
    return;
  }

  const totalPartidas = dados[0].totalPartidas;
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

  graficoLinha = new Chart(document.getElementById("line"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Defesas",
          data: defesas,
          tension: 0.5,
          fill: true,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#2196f3",
          pointRadius: 3,
          pointHoverRadius: 6,
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
          data: [federado, naoFederado],
          borderWidth: 0,
          backgroundColor: ["purple", "aqua"],
          borderWidth: 4,
          hoverOffset: 18,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
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

function preencherTabela(dados) {
  const tbody = document.getElementById("tbodyHistorico");

  tbody.innerHTML = "";

  const ordenados = [...dados]
    .sort((a, b) => new Date(b.dataPartida) - new Date(a.dataPartida))
    .slice(0, 5);

  ordenados.forEach((partida) => {
    let status = "ÓTIMO";

    if (partida.golsSofridos >= 2) {
      status = "RUIM";
    } else if (partida.golsSofridos >= 1) {
      status = "BOM";
    }

    tbody.innerHTML += `
      <tr>
        <td>${new Date(partida.dataPartida).toLocaleDateString("pt-BR")}</td>
        <td>${partida.golsSofridos}</td>
        <td>${partida.tipoPartida}</td>
        <td>${status}</td>
      </tr>
    `;
  });
}
