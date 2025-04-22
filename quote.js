const axios = require('axios');
const crypto = require('crypto');

// API credentials
const apiKey = "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq";
const secretKey = "GSLDrYtqLmXDJRHbqtUwDQLwKBbEgPvu";


function generateSignature(method, path) {
  const data = method.toUpperCase() + path;
  return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

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

    console.log('Quote creada con éxito:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error creando quote:', error.response?.data || error.message);
  }
};



require('dotenv').config();

const {
  GATEFI_API_KEY,
  GATEFI_API_SECRET,
  GATEFI_BASE_URL
} = process.env;

console.log('API Key:', GATEFI_API_KEY);
console.log('API Secret:', GATEFI_API_SECRET);
console.log('Base URL:', GATEFI_BASE_URL);


const createOnrampOrder = async (quote) => {
  const payload = {
    quoteId: quote, 
    chain: 'ETH',
    amount: '500000',
    fromCurrency: 'COP',                            
    toCurrency: 'USDC_ETH',  
    paymentMethodType: 'BANKCARD',
    depositAddress: '0x50953d2f9ecdcb3878583fbc32799602ed4b0777',
    customerId: '3e1a127a-0da9-45aa-8cb8-06cf343b8ca0',
    full_name: 'John Doe',
    email: 'john@example.com',
    successUrl: 'https://tusitio.com/success',
    cancelUrl: 'https://tusitio.com/cancel',
    idempotencyKey: `order_${Date.now()}`
  };

  const path = '/v1/external/onramp';
  const method = 'POST';
  const signature = generateSignature(method, path, GATEFI_API_SECRET);

  console.log('Signature generated:', signature);

  try {
    const response = await axios.post(`${GATEFI_BASE_URL}${path}`, payload, {
      headers: {
        'api-key': GATEFI_API_KEY, //GATEFI_API_KEY,
        'signature': signature,
        'X-Device-Id': '617137b53fc0a8ae0cb075a957dc8117',
        'Content-Type': 'application/json'
      }
    });

    console.log('Onramp Order Created');
    console.log('Response:', response.data);
    console.log('Checkout URL:', response.data.checkoutUrl || '(No checkoutUrl returned)');
  } catch (error) {
    console.error('Error creating onramp order:');
    console.dir(error.response.data || error.message, { depth: null });
  }
};


async function main () {

  // 🧪 Ejemplo de ejecución
  const quote = await createQuote({
    chain: 'ETH',
    fromCurrency: 'COP',
    toCurrency: 'USDC_ETH',  
    fromAmount: '500000',
    paymentMethodType: 'BANKCARD',
    exchangeRule: 'BUY_CRYPTO',
    metadata: JSON.stringify({ reference: 'test-colombia-01' })
  });

  console.log(quote);
  await createOnrampOrder(quote.quoteId);
}


main()


