import fetch from "node-fetch"; // Vercel soporta ESM, v3 de node-fetch

export default async function handler(req, res) {
  try {
    const symbol = req.query.symbol;
    if (!symbol) {
      return res.status(400).json({ error: "Falta el parámetro 'symbol'" });
    }

    const API_KEY = "TU_API_KEY_FINNHUB"; // reemplaza con tu clave Finnhub
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error desde Finnhub" });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error en finnhub-proxy:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
