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

async function fetchStock(symbol) {
  try {
    const res = await fetch(`/.netlify/functions/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function createCard(id, title, price, change) {
  const container = document.getElementById(id);
  const variation = change ? ((change / price) * 100).toFixed(2) : 0;
  const positive = variation >= 0;
  container.style.backgroundColor = positive ? "#008000" : "#a30000";
  container.innerHTML = `
    <div style="font-size: 1.2em; font-weight: bold;">${title}</div>
    <div style="font-size: 1.5em;">€${price.toFixed(2)}</div>
    <div style="font-size: 1em;">${change.toFixed(2)} (${variation}%)</div>
    <canvas id="chart_${id}"></canvas>
  `;

  const ctx = document.getElementById(`chart_${id}`).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: Array(7).fill("").map((_, i) => i + 1),
      datasets: [{
        data: Array(7).fill(price),
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
  for (let key of Object.keys(stocks)) {
    const data = await fetchStock(stocks[key].symbol);
    if (data) {
      createCard(key, stocks[key].name, data.c, data.d);
    }
  }
}

// Actualizar cada minuto
updateAll();
setInterval(updateAll, 60000);
