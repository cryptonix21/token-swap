# Token Swap DApp

This is a decentralized application (DApp) built with React, enabling users to swap `wXDAI` for `wETH` on the xDai network, and automatically swap `wETH` back to `wXDAI`. The app interacts with HoneySwap's Router for token swaps on the xDai blockchain.

## Features

- Connects with Ethereum-compatible wallets (like MetaMask).
- Swaps `wXDAI` to `wETH` and then back to `wXDAI` automatically.
- Displays the user's `wXDAI` and `wETH` balances.
- Automatically calculates the amount of `wETH` received from the swap.

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- xDai tokens (`wXDAI`) in your wallet for testing transactions

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/token-swap-app.git
cd token-swap-app
```

### 2. Install Dependencies
```bash
npm install
```

1. Start the Application
Run the following command to start the development server:

```bash
npm start
```
This will start the app at:

```bash
http://localhost:3000
```

Usage:
1. Connect Wallet: 
Click the Connect Wallet button to connect your MetaMask wallet to the app. Make sure your MetaMask is set to the xDai network.

2. Enter wXDAI Amount :
Enter the amount of wXDAI you want to swap in the input field.

3. Execute Swap : 
Click the Swap wXDAI for wETH and Back button.

This will trigger two transactions:

```bash
Swap wXDAI for the selected token (wETH).
Once the first transaction is confirmed, the app will automatically swap the selected token (wETH) back to wXDAI for the converted value.
```
```bash
Notes:
Ensure that you have enough wXDAI tokens for transaction fees.
If there are any issues with the transaction or process, check the browser console for error messages or status updates.
Ensure your MetaMask is connected to the correct network (xDai) for all transactions to be processed.
```

Code Overview
App.js: Main component handling wallet connection, token swaps, and balance fetching.
connectWallet.js: Utility function to handle MetaMask wallet connection.
Contributing
Feel free to fork this repository and submit pull requests if you'd like to contribute.
```bash
License
This project is open source and available under the MIT License.
```