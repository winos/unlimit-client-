const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const {
  GATEFI_API_KEY,
  GATEFI_API_SECRET,
  GATEFI_BASE_URL
} = process.env;

console.log('API Key:', GATEFI_API_KEY);
console.log('API Secret:', GATEFI_API_SECRET);
console.log('Base URL:', GATEFI_BASE_URL);

function generateSignature(method, path, secret) {
  const dataToSign = method + path;
  return crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');
}

const createOnrampOrder = async () => {
  const payload = {
    quoteId: 'c211021e-480f-4626-bae4-8892db68ebe1', // normalmente generado antes
    fromCurrency: 'USD',
    toCurrency: 'ETH',
    amount: '100',
    chain: 'ETHEREUM',
    paymentMethodType: 'CARD',
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
        'api-key': GATEFI_API_KEY,
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

createOnrampOrder();
