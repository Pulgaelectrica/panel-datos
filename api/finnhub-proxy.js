// api/finnhub-proxy.js
import fetch from "node-fetch"; // Vercel soporta ESM

export default async function handler(req, res) {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: "symbol missing" });
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
