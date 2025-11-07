const stocks = {
  bitcoin: { name: "Bitcoin", symbol: "BINANCE:BTCUSDT" },
  oro: { name: "Oro (XAU/EUR)", symbol: "XAU=EUR" },
  sp500: { name: "S&P 500", symbol: "^GSPC" },
  nvidia: { name: "Nvidia", symbol: "NVDA" },
  tesla: { name: "Tesla", symbol: "TSLA" },
  apple: { name: "Apple", symbol: "AAPL" },
  amazon: { name: "Amazon", symbol: "AMZN" },
  google: { name: "Google", symbol: "GOOGL" }
};

async function fetchData(symbol) {
  try {
    const res = await fetch(`/api/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    return data.c ? [data.c] : [0]; // usamos solo el último precio
  } catch (e) {
    console.error(e);
    return [0];
  }
}

function createCard(id, title, data) {
  const container = document.getElementById(id);
  const variation = ((data[data.length - 1] / data[0] - 1) * 100).toFixed(2);
  const absChange = (data[data.length - 1] - data[data.length - 2] || 0).toFixed(2);
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
      datasets: [{ data: data, borderColor: "white", borderWidth: 1, fill: false, tension: 0.3 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  });
}

async function updateAll() {
  for (const key of Object.keys(stocks)) {
    const data = await fetchData(stocks[key].symbol);
    createCard(key, stocks[key].name, data);
  }
}

// refresca cada minuto
updateAll();
setInterval(updateAll, 60000);
