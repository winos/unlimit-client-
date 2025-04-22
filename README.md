# 🚀 API Unlimit Client

A lightweight Node.js client to interact with the [Unlimit (GateFi) API](https://docs.gatefi.com), supporting:

- 🔐 HMAC-SHA256 signature generation
- 💱 Quote creation (`/v1/external/quotes`)
- 💳 Onramp order creation (`/v1/external/onramp`)
- 📦 Wallet address support (e.g. from rail.io)

---

## ⚙️ Setup

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env` file**

```env
GATEFI_API_KEY=your_api_key
GATEFI_API_SECRET=your_api_secret
GATEFI_BASE_URL=https://api-sandbox.gatefi.com
```

---

## 🧪 Usage

### ▶️ Create a quote

```bash
node quote.js
```

### ▶️ Create an onramp order

```bash
node checkout.js
```

---

## 📁 Files

- `quote.js` → Creates a quote for fiat-to-crypto
- `checkout.js` → Creates a payment order and returns checkout URL
- `.env` → API credentials
- `README.md` → Project documentation

---

## 📝 License

MIT © You
