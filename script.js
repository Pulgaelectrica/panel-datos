const API_URL = '/.netlify/functions/finnhub-proxy';
const REFRESH_INTERVAL = 60000; // 1 minuto

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
    const res = await fetch(`${API_URL}?symbol=${encodeURIComponent(symbol)}`);
    const data = await res.json();
    return data.c; // precio actual
  } catch (e) {
    console.error(`Error al cargar ${symbol}`, e);
    return null;
  }
}

async function updateCard(id, title, symbol, prevData = []) {
  const price = await fetchStock(symbol);
  if (price === null) return prevData;

  const data = [...prevData, price].slice(-7); // mantener últimas 7 medidas
  const container = document.getElementById(id);
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

  return data;
}

const cardData = {};
Object.keys(stocks).forEach(async key => {
  cardData[key] = [];
  cardData[key] = await updateCard(key, stocks[key].name, stocks[key].symbol, cardData[key]);
  setInterval(async () => {
    cardData[key] = await updateCard(key, stocks[key].name, stocks[key].symbol, cardData[key]);
  }, REFRESH_INTERVAL);
});
