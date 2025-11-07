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

// Función para obtener el precio actual desde la función proxy
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

// Función para actualizar cada tarjeta
async function updateCard(id, stock) {
  const price = await fetchStock(stock.symbol);
  const container = document.getElementById(id);
  const prev = container.dataset.prev ? parseFloat(container.dataset.prev) : price;
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

  // Crear gráfico simple con 7 puntos iguales al último precio
  const ctx = document.getElementById(`chart_${id}`).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: [1,2,3,4,5,6,7],
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

  container.dataset.prev = price;
}

// Actualiza todas las tarjetas
async function updateAll() {
  for (const key of Object.keys(stocks)) {
    await updateCard(key, stocks[key]);
  }
}

// Ejecutar al inicio y cada minuto
updateAll();
set

