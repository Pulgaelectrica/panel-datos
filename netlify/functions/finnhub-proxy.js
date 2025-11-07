exports.handler = async function(event, context) {
  const symbol = event.queryStringParameters.symbol;
  const apiKey = "d46ks21r01qgc9etb0o0d46ks21r01qgc9etb0og"; // Tu API Finnhub

  try {
    // Usando fetch global de Node 22
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const data = await res.json();

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
