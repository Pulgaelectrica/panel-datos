import fetch from "node-fetch";

export async function handler(event) {
  try {
    const symbol = event.queryStringParameters.symbol;
    const API_KEY = "d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og";
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
