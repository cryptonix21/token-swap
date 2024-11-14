import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./connectWallet";
import { getRandomToken } from "./randomToken";
import "./App.css"; // For getting random tokens

// xDai Address (using the address you provided)
const xdaiAddress = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"; // xDai Address
const honeyswapRouterAddress = "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77"; // HoneySwap Router

export default function App() {
  const [amount, setAmount] = useState(""); // Amount in xDai
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [randomToken, setRandomToken] = useState(null); // Random token state
  const [nativeBalance, setNativeBalance] = useState(""); // Native balance in ETH/xDai
  const [randomTokenAmount, setRandomTokenAmount] = useState(""); // Amount of random token

  // Connect wallet and set signer
  const handleConnectWallet = async () => {
    const signer = await connectWallet();
    if (signer) {
      setSigner(signer);
      setConnected(true);
      await fetchNativeBalance();
    }
  };

  // Fetch native balance
  const fetchNativeBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const balance = await signer.getBalance();
      const balanceInEth = ethers.utils.formatEther(balance); // Convert to ETH/xDai
      setNativeBalance(balanceInEth);
    } catch (error) {
      console.error("Failed to fetch native balance:", error);
    }
  };

  // Function to get the Random Token equivalent for the given xDai amount
  const getRandomTokenFromXDAI = async (xdaiAmount) => {
    if (!randomToken || !signer || !xdaiAmount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const router = new ethers.Contract(
      honeyswapRouterAddress,
      [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      ],
      provider
    );

    try {
      const path = [xdaiAddress, randomToken.address];
      const amountsOut = await router.getAmountsOut(
        ethers.utils.parseUnits(xdaiAmount, 18),
        path
      );
      const tokenAmount = ethers.utils.formatUnits(amountsOut[1], 18);
      setRandomTokenAmount(tokenAmount);
    } catch (error) {
      console.error("Error fetching random token equivalent:", error);
    }
  };

  const handleAmountChange = (e) => {
    const xdaiAmount = e.target.value;
    setAmount(xdaiAmount);
    getRandomTokenFromXDAI(xdaiAmount);
  };

  const handleGetRandomToken = async () => {
    const token = await getRandomToken();
    if (token && token.address) {
      setRandomToken(token);
      setRandomTokenAmount("");
      setAmount("");
    } else {
      console.error("Random token is not valid:", token);
    }
  };

  // First swap from xDai to random token
  const swapTokens = async (amountIn, tokenIn, tokenOut) => {
    if (!signer) {
      console.error("Signer is not provided.");
      return;
    }

    const router = new ethers.Contract(
      honeyswapRouterAddress,
      [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      ],
      signer
    );

    const path = [tokenIn, tokenOut];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const amountInParsed = ethers.utils.parseUnits(amountIn, 18);

    try {
      const tx = await router.swapExactTokensForTokens(
        amountInParsed,
        0,
        path,
        await signer.getAddress(),
        deadline
      );
      await tx.wait();
      console.log("First swap completed successfully.");
    } catch (error) {
      console.error("First swap failed:", error);
    }
  };

  // Second swap from random token back to xDai
  const swapBackToXDAI = async (randomTokenAmount) => {
    if (!signer || !randomToken) {
      console.error("Signer or random token is not provided.");
      return;
    }

    const router = new ethers.Contract(
      honeyswapRouterAddress,
      [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      ],
      signer
    );

    const path = [randomToken.address, xdaiAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const amountInParsed = ethers.utils.parseUnits(randomTokenAmount, 18);

    try {
      const tx = await router.swapExactTokensForTokens(
        amountInParsed,
        0,
        path,
        await signer.getAddress(),
        deadline
      );
      await tx.wait();
      console.log("Second swap back to xDai completed successfully.");
    } catch (error) {
      console.error("Second swap failed:", error);
    }
  };

  const handleSwap = async () => {
    if (!signer || !randomToken) {
      alert("Please connect your wallet and get a random token first.");
      return;
    }

    await swapTokens(amount, xdaiAddress, randomToken.address);

    // Automatically perform the second swap from random token back to xDai
    await swapBackToXDAI(randomTokenAmount);
  };

  return (
    <div className="container">
      <h1>Token Swap</h1>
      {!connected ? (
        <button className="connect-button" onClick={handleConnectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="swap-box">
          <div className="input-section">
            <input
              type="number"
              placeholder="0.0"
              className="input-field"
              value={amount}
              onChange={handleAmountChange}
            />
            <span>XDAI</span>
          </div>
          <div className="balance-section">
            <p>Native Balance: {nativeBalance} XDAI</p>
          </div>
          <div className="input-section">
            <input
              type="number"
              placeholder="0.0"
              className="input-field"
              value={randomTokenAmount}
              disabled
            />
            <span>{randomToken ? randomToken.symbol : "Token"}</span>
          </div>
          <button className="action-button" onClick={handleGetRandomToken}>
            Get Random Token
          </button>
          {randomToken && (
            <div className="token-info">
              <p>
                Random Token: {randomToken.name} ({randomToken.symbol})
              </p>
            </div>
          )}
          <button className="action-button" onClick={handleSwap}>
            Swap XDAI for {randomToken ? randomToken.symbol : "Token"} and Back
          </button>
        </div>
      )}
    </div>
  );
}

