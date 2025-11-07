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

// Guardar últimos 7 datos para graficar
const history = {};
Object.keys(stocks).forEach(key => history[key] = []);

async function fetchData(symbol) {
  try {
    const res = await fetch(`/api/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    // Finnhub devuelve "c" = precio actual
    return data.c;
  } catch (err) {
    console.error("Error fetchData", err);
    return null;
  }
}

async function updateCard(key) {
  const price = await fetchData(stocks[key].symbol);
  if (price === null) return;

  const container = document.getElementById(key);

  // Actualizar historial
  history[key].push(price);
  if (history[key].length > 7) history[key].shift();

  const data = history[key];
  const variation = ((data[data.length - 1] / data[0] - 1) * 100).toFixed(2);
  const absChange = (data[data.length - 1] - data[data.length - 2]).toFixed(2);
  const positive = variation >= 0;

  container.style.backgroundColor = positive ? "#008000" : "#a30000";
  container.innerHTML = `
    <div style="font-size: 1.2em; font-weight: bold;">${stocks[key].name}</div>
    <div style="font-size: 1.5em;">€${data[data.length - 1].toFixed(2)}</div>
    <div style="font-size: 1em;">${absChange} (${variation}%)</div>
    <canvas id="chart_${key}"></canvas>
  `;

  const ctx = document.getElementById(`chart_${key}`).getContext("2d");
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
    await updateCard(key);
  }
}

// Actualizar cada minuto
updateAll();
setInterval(updateAll, 60000);


