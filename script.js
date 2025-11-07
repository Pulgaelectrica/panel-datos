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
    const res = await fetch(`/api/finnhub-proxy?symbol=${symbol}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetchData", err);
    return null;
  }
}

async function updateCard(cardId, symbol) {
  const data = await fetchData(symbol);
  const card = document.getElementById(`card-${cardId}`);
  
  if (!data || data.c === undefined) {
    card.style.backgroundColor = "#333";
    card.innerHTML = `<p>Error</p>`;
    return;
  }

  const change = data.d;
  card.style.backgroundColor = change >= 0 ? "green" : "red";
  card.innerHTML = `
    <p>${symbol}</p>
    <p>${data.c.toFixed(2)}</p>
    <p>${change.toFixed(2)} (${data.dp.toFixed(2)}%)</p>
  `;
}

async function updateAll() {
  for (let i = 0; i < symbols.length; i++) {
    await updateCard(i, symbols[i]);
  }
}

// Actualizar cada 10 segundos
updateAll();
setInterval(updateAll, 10000);

