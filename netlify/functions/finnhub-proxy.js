const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const symbol = event.queryStringParameters.symbol;
  const API_KEY = "d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og"; // Tu API Finnhub

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
