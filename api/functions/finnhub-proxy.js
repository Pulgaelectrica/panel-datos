export default async function handler(req, res) {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Debes pasar un símbolo como query param" });

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  if (!FINNHUB_API_KEY) return res.status(500).json({ error: "No se ha configurado la API Key de Finnhub" });

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener datos de Finnhub" });
  }
}
