const API_BASE = "https://panel-datos-gjfb.vercel.app/api/finnhub-proxy"; // Cambia por tu URL real en Vercel

const symbols = [
  "BINANCE:BTCUSDT",
  "OANDA:XAU_EUR",
  "INDEX:SPX",
  "NASDAQ:NVDA",
  "NASDAQ:TSLA",
  "NASDAQ:AAPL",
  "NASDAQ:AMZN",
  "NASDAQ:GOOGL"
];

async function fetchData(symbol) {
  try {
    const response = await fetch(`${API_BASE}?symbol=${encodeURIComponent(symbol)}`);

    if (!response.ok) {
      console.warn(`Error ${response.status} al obtener ${symbol}`);
      return null; // Retorna null si hay error
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetchData ${symbol}:`, error);
    return null;
  }
}

async function updateCard(card, symbol) {
  const data = await fetchData(symbol);
  
  if (!data || data.c === undefined) {
    card.querySelector(".value").textContent = "Error";
    card.style.backgroundColor = "#800"; // Rojo si hay error
    return;
  }

  const change = data.d || 0;
  const changePercent = data.dp || 0;

  card.querySelector(".symbol").textContent = symbol;
  card.querySelector(".value").textContent = data.c.toFixed(2);
  card.querySelector(".change").textContent = `${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
  
  // Cambiar color según el cambio
  card.style.backgroundColor = change >= 0 ? "#060" : "#800";
}

async function updateAll() {
  const cards = document.querySelectorAll(".card");
  for (let i = 0; i < cards.length;



