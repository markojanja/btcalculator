export const allCurrencyPairs = [
  "AUD/BRL",
  "AUD/CHF",
  "AUD/JPY",
  "AUD/NZD",
  "AUD/SGD",
  "AUD/TRY",
  "AUD/USD",
  "AUD/ZAR",
  "CAD/CHF",
  "CAD/JPY",
  "CAD/ZAR",
  "CHF/JPY",
  "CHF/TRY",
  "CHF/ZAR",
  "EUR/AUD",
  "EUR/BRL",
  "EUR/CHF",
  "EUR/CZK",
  "EUR/GBP",
  "EUR/HUF",
  "EUR/JPY",
  "EUR/NZD",
  "EUR/TRY",
  "EUR/USD",
  "GBP/AUD",
  "GBP/BRL",
  "GBP/CAD",
  "GBP/CHF",
  "GBP/INR",
  "GBP/JPY",
  "GBP/NZD",
  "GBP/SGD",
  "GBP/TRY",
  "GBP/USD",
  "GBP/ZAR",
  "NZD/CAD",
  "NZD/JPY",
  "NZD/SGD",
  "NZD/TRY",
  "NZD/USD",
  "NZD/ZAR",
  "USD/BHD",
  "USD/BRL",
  "USD/CAD",
  "USD/CHF",
  "USD/CNH",
  "USD/HKD",
  "USD/IDR",
  "USD/INR",
  "USD/JPY",
  "USD/KES",
  "USD/KRW",
  "USD/MXN",
  "USD/MYR",
  "USD/PHP",
  "USD/RUB",
  "USD/SGD",
  "USD/THB",
  "USD/TRY",
  "USD/ZAR",
];

export const uniqueCurrencies = [
  "AUD",
  "BHD",
  "BRL",
  "CAD",
  "CHF",
  "CNH",
  "CZK",
  "GBP",
  "EUR",
  "HKD",
  "HUF",
  "IDR",
  "INR",
  "JPY",
  "KES",
  "KRW",
  "MXN",
  "MYR",
  "NZD",
  "PHP",
  "RUB",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
];
export const calcType = ["forex", "cfd"];
export const tradeTypeList = ["BUY", "SELL"];

export const pipHowTo = {
  content: `
## How to Use the Pip Value Calculator

### 1. Select the currency pair
Click the dropdown menu under **"currency pair"** and choose the pair you want to calculate the pip value for (e.g., EUR/USD).

### 2. Enable Edit Mode (if needed)
- If you want to manually enter the exchange rate, check if **Edit Mode** is enabled.
- If **Edit Mode** is off, the exchange rate is **fetched online automatically**.
- If **Edit Mode** is on, you can click on the "exchange rate" field and enter your own value.

### 3. Enter the position size
Input the size of your trade in the **"position size"** field (e.g., **100,000**).

### 4. Confirm the pip size
The **standard pip size** (e.g., 0.0001 for most currency pairs) is prefilled.

### 5. Choose your account currency
Select the currency in which you want the pip value to be calculated (e.g., **EUR**).

### 6. Optional: Show conversion rate
*(Only available when deposit currency differs from the quote currency)*  
- If your **account currency** is different from the quote currency in the selected pair, the **"Show conversion rate"** checkbox will become enabled.
- When **Edit Mode** is on, you can **manually edit** this conversion rate.

### 7. Click the "Calculate" button
The system will process the input and display the pip value based on the provided details.
`,
};

export const formatPipValue = (value) => {
  return Math.abs(value - Math.round(value)) < 1e-5 ? Math.round(value) : Number(value.toFixed(5));
};
