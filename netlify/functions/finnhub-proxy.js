const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const symbol = event.queryStringParameters.symbol;
  const apiKey = "d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og"; // Tu API Finnhub

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
