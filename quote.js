const axios = require('axios');
const crypto = require('crypto');

// API credentials
const apiKey = "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq";
const secretKey = "GSLDrYtqLmXDJRHbqtUwDQLwKBbEgPvu";

// Función para generar firma
function generateSignature(method, path) {
  const data = method.toUpperCase() + path;
  return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

// Simulación de una solicitud para crear una quote
const createQuote = async ({
  chain,
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  paymentMethodType,
  metadata
}) => {
  try {
    // Validaciones básicas
    if (!fromCurrency || !toCurrency || !paymentMethodType) {
      throw new Error('fromCurrency, toCurrency, and paymentMethodType are required.');
    }

    if ((fromAmount && toAmount) || (!fromAmount && !toAmount)) {
      throw new Error('Provide either fromAmount or toAmount, but not both.');
    }

    let parsedMetadata = null;
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (err) {
        throw new Error('Metadata must be a valid JSON string.');
      }
    }

    // Construcción del body
    const requestBody = {
      ...(chain && { chain }),
      ...(fromAmount && { fromAmount }),
      ...(toAmount && { toAmount }),
      fromCurrency,
      toCurrency,
      paymentMethodType,
      ...(parsedMetadata && { metadata: parsedMetadata })
    };

    const path = '/v1/external/quotes';
    const signature = generateSignature('POST', path);

    console.log(`🛡️ Signature: ${signature}`);
    console.log(`📦 Request Body:`, requestBody);

    // Petición a la API de GateFi
    const response = await axios.post(`https://api-sandbox.gatefi.com${path}`, requestBody, {
      headers: {
        'api-key': apiKey,
        'signature': signature,
        'Content-Type': 'application/json',
      }
    });

    console.log('✅ Quote creada con éxito:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Error creando quote:', error.response?.data || error.message);
  }
};

// 🧪 Ejemplo de ejecución
createQuote({
  chain: 'ETHEREUM',
  fromCurrency: 'USD',
  toCurrency: 'ETH',
  fromAmount: '100',
  paymentMethodType: 'CARD',
  metadata: JSON.stringify({ reference: 'internal-test-001' })
});
