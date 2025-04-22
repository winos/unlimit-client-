const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const {
  GATEFI_API_KEY,
  GATEFI_API_SECRET
} = process.env;

const createBuyWidget = async () => {
  const params = {
    amount: '"50"', // entre comillas como string
    crypto: 'ETH',
    fiat: 'USD',
    orderCustomId: `order_${Date.now()}`,
    partnerAccountId: 'your-partner-account-id',
    payment: 'BANKCARD',
    region: 'US',
    redirectUrl: 'https://yourapp.com/done',
    cancelUrl: 'https://yourapp.com/cancel',
    successUrl: 'https://yourapp.com/success',
    walletAddress: '0x50953d2f9ecdcb3878583fbc32799602ed4b0777'
  };

  // Construye la query string ordenada
  const queryString = new URLSearchParams(params).toString();

  // Firma el query string
  const signature = crypto
    .createHmac('sha256', GATEFI_API_SECRET)
    .update(queryString)
    .digest('hex');

  const url = `https://api-sandbox.gatefi.com/onramp/v1/buy?${queryString}`;

  try {
    const response = await axios.get(url, {
      maxRedirects: 0, // para capturar el 303
      headers: {
        'api-key': GATEFI_API_KEY,
        signature
      },
      validateStatus: status => status === 303
    });

    const widgetUrl = response.headers.location;
    console.log('✅ Redirect to widget:', widgetUrl);
  } catch (error) {
    console.error('❌ Error generating widget:', error.response?.data || error.message);
  }
};

createBuyWidget();
