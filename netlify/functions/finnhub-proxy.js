const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const symbol = event.queryStringParameters.symbol;
  const API_KEY = 'd46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og';

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
