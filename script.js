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

async function fetchStock(symbol) {
  try {
    const res = await fetch(`/.netlify/functions/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    // Finnhub devuelve {c: current, h: high, l: low, o: open, pc: prev_close}
    return data.c || 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

async function updateCard(id, stock) {
  const price = await fetchStock(stock.symbol);
  const container = document.getElementById(id);
  const prev = container.dataset.prev ? parseFloat(container.dataset.prev) : price;
  const variation = ((price / prev - 1) * 100).toFixed(2);
  const absChange = (price - prev).toFixed(2);
  const positive = variation >= 0;

  container.style.backgroundColor = positive ? "#008000" : "#a30000";
  container.innerHTML = `
    <div style="font-size: 1.2em; font-weight: bold;">${stock.name}</div>
    <div style="font-size: 1.5em;">€${price.toFixed(2)}</div>
    <div style="font-size: 1em;">${absChange} (${variation}%)</div>
    <canvas id="chart_${id}"></canvas>
  `;

  const ctx = document.getElementById(`chart_${id}`).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: [1,2,3,4,5,6,7],
      datasets: [{ data: Array(7).fill(price), borderColor: "white", borderWidth: 1, fill: false, tension: 0.3 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
  });

  container.dataset.prev = price;
}

async function updateAll() {
  for (const key of Object.keys(stocks)) {
    await updateCard(key, stocks[key]);
  }
}

// Inicia y actualiza cada minuto
updateAll();
setInterval(updateAll, 60000);
