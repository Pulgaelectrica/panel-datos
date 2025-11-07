// /api/finnhub-proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const symbol = req.query.symbol;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol required" });
  }

  try {
    const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
