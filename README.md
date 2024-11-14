# Token Swap App

This is a decentralized application (DApp) built with React, enabling users to swap `xDai` for a randomly selected token on the xDai network, and then automatically swap the token back to `xDai`. The app interacts with HoneySwap's Router for token swaps on the xDai blockchain.

## Features

- Connects with Ethereum-compatible wallets (like MetaMask).
- Swaps `xDai` to a randomly selected token and then back to `xDai` automatically.
- Shows the user's token balance.
- Automatically calculates values during each swap.

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension
- xDai tokens in your wallet for testing transactions

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/token-swap-app.git
cd token-swap-app
```

### Configuration

1. Set Up Environment Variables
Create a .env file in the project root directory to set up the addresses for xDai token and HoneySwap router. These are essential for token swaps on the xDai network.

Add the following content to the .env file:


```bash
xDai Token: 0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d
HoneySwap Router: 0x1C232F01118CB8B424793ae03F870aa7D0ac7f77
```

1. Start the Application
Run the following command to start the application:

```bash 
npm start 
```

This will start the development server and launch the app at :
```bash
http://localhost:3000.
```
Usage
1. Connect Wallet: 
Click the Connect Wallet button to connect your MetaMask wallet to the app. Ensure that your MetaMask is set to the xDai network.

1. Select Random Token: 
Click the Get Random Token button to fetch a randomly selected token on the xDai network. This token will be used for the swap.

1. Enter xDai Amount: 
Enter the amount of xDai you want to swap in the input field.

1. Execute Swap: 
Click the Swap XDAI for Token and Back button.

This will trigger two transactions:
The first one will swap the specified amount of xDai for the randomly selected token.
Once the first transaction is confirmed, the app will automatically swap the random token back to xDai for the converted value.
Notes
Make sure you have enough xDai tokens for transaction fees.
If there are any issues with the transaction or the process, check the browser console for error messages or status updates.

Ensure your MetaMask is connected to the correct network (xDai) for all transactions to be processed.# token-swap
