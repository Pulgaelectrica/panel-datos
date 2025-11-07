const stocks = {
  bitcoin: { name: "Bitcoin", symbol: "BINANCE:BTCUSDT" },
  oro: { name: "Oro (XAU/EUR)", symbol: "OANDA:XAU_EUR" },
  sp500: { name: "S&P 500", symbol: "INDEX:SPX" },
  nvidia: { name: "Nvidia", symbol: "NASDAQ:NVDA" },
  tesla: { name: "Tesla", symbol: "NASDAQ:TSLA" },
  apple: { name: "Apple", symbol: "NASDAQ:AAPL" },
  amazon: { name: "Amazon", symbol: "NASDAQ:AMZN" },
  google: { name: "Google", symbol: "NASDAQ:GOOGL" }
};

// Configuración global de Chart.js
Chart.defaults.font.family = "'Source Han Sans CN', sans-serif";
const stocks = {
  bitcoin: { name: "Bitcoin", symbol: "BINANCE:BTCUSDT" },
  oro: { name: "Oro (XAU/EUR)", symbol: "OANDA:XAU_EUR" },
  sp500: { name: "S&P 500", symbol: "INDEX:SPX" },
  nvidia: { name: "Nvidia", symbol: "NASDAQ:NVDA" },
  tesla: { name: "Tesla", symbol: "NASDAQ:TSLA" },
  apple: { name: "Apple", symbol: "NASDAQ:AAPL" },
  amazon: { name: "Amazon", symbol: "NASDAQ:AMZN" },
  google: { name: "Google", symbol: "NASDAQ:GOOGL" }
};

// Configuración global Chart.js
Chart.defaults.font.family = "'Source Han Sans CN', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.enabled = true;

// Llamada a la función proxy de Netlify
async function fetchStockFinnhub(symbol) {
  try {
    const res = await fetch(`/.netlify/functions/finnhub-proxy?symbol=${symbol}`);
    const json = await res.json();
    return [json.pc, json.c]; // prevClose y current
  } catch (e) {
    console.error("Error fetching", symbol, e);
    return null;
  }
}

function createCard(id, title, data) {
  const container = document.getElementById(id);
  if (!data || data.length < 2) {
    container.innerHTML = `<div>${title}: No hay datos</div>`;
    return;
  }

  const variation = ((data[data.length - 1] / data[0] - 1) * 100).toFixed(2);
  const absChange = (data[data.length - 1] - data[data.length - 2]).toFixed(2);
  const positive = variation >= 0;
  container.style.backgroundColor = positive ? "#008000" : "#a30000";

  container.innerHTML = `
    <div style="font-size: 1.2em; font-weight: bold;">${title}</div>
    <div style="font-size: 1.5em;">€${data[data.length - 1].toFixed(2)}</div>
    <div style="font-size: 1em;">${absChange} (${variation}%)</div>
    <canvas id="chart_${id}"></canvas>
  `;

  const ctx = document.getElementById(`chart_${id}`).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        data: data,
        borderColor: "white",
        borderWidth: 1,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

async function updateAll() {
  for (const key of Object.keys(stocks)) {
    const data = await fetchStockFinnhub(stocks[key].symbol);
    if (data) createCard(key, stocks[key].name, data);
  }
}

// Primera actualización
updateAll();

// Actualizar cada minuto
setInterval(updateAll, 60 * 1000);

