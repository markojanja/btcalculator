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

export const pnlHowTo = {
  content: `## How to Use the PnL Calculator

### 1. Select the currency pair  
Click the dropdown menu under **"currency pair"** and choose the pair you want to calculate the PnL for (e.g., **EUR/USD**).

### 2. Choose Buy or Sell  
Select whether you are **buying** or **selling** the currency pair.

### 3. Enter the Open Price  
Input the price at which you opened your trade in the **"open price"** field.

### 4. Enter the Close Price  
Input the price at which you closed your trade in the **"close price"** field.

### 5. Set the Trade Size (Lots)  
Enter the **trade size** in **lots** (e.g., **1 lot**).

### 6. Select Your Account Currency  
Choose the currency in which you want to see your **profit/loss** (e.g., **RUB**).

### 7. Click the "Calculate" Button  
Press the **Calculate** button to process your input and display the **PnL result**.

### 8. View the PnL Output  
Your **profit or loss** will be displayed at the bottom in the selected **account currency**.
`,
};

export const marginHowTo = {
  content: `## How to Use the Margin Calculator

### 1. Select the Type of Calculation  
Choose between **Forex** or **CFD** by clicking the corresponding button.

This selection will determine which type fo calculation will be used for margin calculation.

### 2. Choose the Symbol  
Select the currency pair or instrument from the **"symbol"** dropdown (e.g., **EUR/USD**).

### 3. Choose the Trade Type  
Select whether you are **buying** or **selling** the instrument.

### 4. Enter the Contract Size  
Input the **contract size** for your trade (e.g., **100,000** for standard forex lots).

### 5. Enter the Lot Size  
Specify the number of **lots** in the **lot size** field.

### 6. Enter the Leverage/Margin  
Set your **leverage** value (e.g., **100**).

Set your **margin** value (e.g., **5%**).

### 7. Enter the Price 
Input the **instrument's price**.

### 8. Choose Your Account Currency  
Select the currency in which you want the margin to be calculated (e.g., **EUR**).

### 9. Show Conversion Rate (Optional)  
Check the **"Show conversion rate"** option if your account currency differs from the quote currency.

### 10. Click the "Calculate" Button  
Press the **Calculate** button to process your input and display the **margin requirement**.

`,
};

export const swapHowTo = {
  content: `## How to Use the Swap Calculator

### 1. Symbol Settings  
- **Symbol**: Select the trading pair (e.g., **EUR/USD**).  
- **Contract Size**: Enter the number of units per lot (e.g., **100,000**).  
- **Pip Size**: Displays the pip value for the selected instrument (e.g., **0.00001**).  

### 2. Swap Settings  
- **Calculation Type**: Choose between different calculation methods (e.g., **money**).  
- **3-Day Swap**: Select the day when a triple swap is applied (e.g., **Wednesday**).  
- **Long Swap**: Displays the swap rate for long positions.  
- **Short Swap**: Displays the swap rate for short positions.  

### 3. Trade Settings  
- **Account Currency**: Select the currency in which the swap will be calculated (e.g., **USD**).  
- **Trade Type**: Choose **BUY** or **SELL** for your position.  
- **Asset Price**: Enter the price of the instrument at the time of trade.  
- **Lots**: Input the trade size in lots (e.g., **0.01**).  
- **Date Open**: Select the date when the trade was opened.  
- **Date Close**: Select the closing date of the trade.  

### 4. Click "Calculate"  
Press the **Calculate** button to compute the swap value for your trade.


`,
};
