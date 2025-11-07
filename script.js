const stocks = {
  bitcoin: { name: "Bitcoin", symbol: "BINANCE:BTCUSDT", history: [] },
  oro: { name: "Oro (XAU/EUR)", symbol: "OANDA:XAU_EUR", history: [] },
  sp500: { name: "S&P 500", symbol: "INDEX:SPX", history: [] },
  nvidia: { name: "Nvidia", symbol: "NASDAQ:NVDA", history: [] },
  tesla: { name: "Tesla", symbol: "NASDAQ:TSLA", history: [] },
  apple: { name: "Apple", symbol: "NASDAQ:AAPL", history: [] },
  amazon: { name: "Amazon", symbol: "NASDAQ:AMZN", history: [] },
  google: { name: "Google", symbol: "NASDAQ:GOOGL", history: [] }
};

// Obtener precio desde la función proxy
async function fetchStock(symbol) {
  try {
    const res = await fetch(`/.netlify/functions/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    return data.c || 0; // 'c' es el precio actual
  } catch (e) {
    console.error("Error al obtener datos de", symbol, e);
    return 0;
  }
}

// Actualiza cada tarjeta y gráfico
async function updateCard(id, stock) {
  const price = await fetchStock(stock.symbol);
  const container = document.getElementById(id);

  // Guardar histórico de los últimos 7 precios
  stock.history.push(price);
  if (stock.history.length > 7) stock.history.shift();

  const prev = stock.history.length > 1 ? stock.history[stock.history.length - 2] : price;
  const absChange = (price - prev).toFixed(2);
  const variation = ((price / prev - 1) * 100).toFixed(2);
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
      labels: stock.history.map((_, i) => i + 1),
      datasets: [{
        data: stock.history,
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

// Actualiza todas las tarjetas
async function updateAll() {
  for (const key of Object.keys(stocks)) {
    await updateCard(key, stocks[key]);
  }
}

// Ejecutar al inicio y cada minuto
updateAll();
setInterval(updateAll, 60000);

