import React, { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/connectWallet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

// wXDAI and wETH Addresses
const wxdaiAddress = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";
const wethAddress = "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1";

// HoneySwap Router
const honeyswapRouterAddress = "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77";

export default function App() {
  const [amount, setAmount] = useState(""); // Amount in wXDAI
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [nativeBalance, setNativeBalance] = useState("");
  const [wethBalance, setWethBalance] = useState(""); // Native wXDAI balance
  const [tokenAmount, setTokenAmount] = useState(""); // Amount of wETH

  // Connect wallet and set signer
  const handleConnectWallet = async () => {
    try {
      const signer = await connectWallet();
      if (signer) {
        setSigner(signer); // Update the state
        setConnected(true);
        console.log("Signer initialized:", signer);

        await fetchNativeBalance(signer); // Pass signer directly
        console.log("after fetchNativeBalance");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Updated fetchNativeBalance to accept signer as an argument
  const fetchNativeBalance = async (signer) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const address = await signer.getAddress();

      const wxdaiAddress = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"; // Replace with actual wXDAI contract address
      const erc20ABI = [
        "function balanceOf(address account) view returns (uint256)",
      ];
      const wxdaiContract = new ethers.Contract(
        wxdaiAddress,
        erc20ABI,
        provider
      );

      const wethContract = new ethers.Contract(wethAddress, erc20ABI, provider);

      const wethBalance1 = await wethContract.balanceOf(address);

      // Fetch balance of wXDAI
      const balance = await wxdaiContract.balanceOf(address);

      // Format the balance from Wei to Ether (18 decimals)
      const balanceInEth = ethers.utils.formatEther(balance);

      // Fetch balance of wETH

      const balanceInWeth = ethers.utils.formatEther(wethBalance1);

      console.log("Fetched wXDAI balance:", balanceInEth);
      console.log("Fetched wETH balance:", balanceInWeth);

      setNativeBalance(balanceInEth);
      setWethBalance(balanceInWeth);
    } catch (error) {
      console.error("Failed to fetch wXDAI balance:", error);
    }
  };

  // Function to get wETH equivalent for the given wXDAI amount
  const getTokenFromWXDAI = async (wxdaiAmount) => {
    if (!signer || !wxdaiAmount) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const router = new ethers.Contract(
      honeyswapRouterAddress,
      [
        "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      ],
      provider
    );

    try {
      const path = [wxdaiAddress, wethAddress];
      const amountsOut = await router.getAmountsOut(
        ethers.utils.parseUnits(wxdaiAmount, 18),
        path
      );
      const tokenAmount = ethers.utils.formatUnits(amountsOut[1], 18);
      setTokenAmount(tokenAmount);
    } catch (error) {
      console.error("Error fetching wETH equivalent:", error);
    }
  };

  const handleAmountChange = (e) => {
    const wxdaiAmount = e.target.value;
    setAmount(wxdaiAmount);
    getTokenFromWXDAI(wxdaiAmount);
  };

  // Approve the tokens to the router contract
  const approveWXdaiToken = async (tokenAddress, amountIn) => {
    if (!signer || !tokenAddress || !amountIn) {
      console.error("Missing signer, token address, or amount");
      return;
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      signer
    );

    try {
      const tx = await tokenContract.approve(
        honeyswapRouterAddress,
        ethers.utils.parseUnits(amountIn, 18)
      );
      await tx.wait();
      toast.success("wXDAI approved for swap!");
    } catch (error) {
      toast.error("Approval failed. See console for details.");
    }
  };
  const approveWethToken = async (tokenAddress, amountIn) => {
    if (!signer || !tokenAddress || !amountIn) {
      toast.error("Signer is not provided.");
      return;
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      signer
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const tx = await tokenContract.approve(
        honeyswapRouterAddress,
        ethers.utils.parseUnits(amountIn, 18)
      );
      await tx.wait();
      toast.success("wETH approved for swap!");
    } catch (error) {
      toast.error("Approval failed. See console for details.");
    }
  };

  // Swap from wXDAI to wETH
  const swapTokens = async (amountIn, tokenIn, tokenOut) => {
    if (!signer) {
      toast.error("Signer is not provided.");
      return;
    }

    // Approve the token before swapping
    await approveWXdaiToken(tokenIn, amountIn);

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
      await new Promise((resolve) => setTimeout(resolve, 6000));
      const tx = await router.swapExactTokensForTokens(
        amountInParsed,
        0,
        path,
        await signer.getAddress(),
        deadline
      );
      const receipt = await tx.wait();
      console.log("First swap (wXdai -> wEth) ) completed!", receipt);
      toast.success("Swap completed successfully.");
    } catch (error) {
      toast.error("Swap failed");
    }
  };
  const swapBackTokens = async (amountIn, tokenIn, tokenOut) => {
    if (!signer) {
      toast.success("Signer is not provided.");
      return;
    }

    // Approve the token before swapping
    await approveWethToken(tokenIn, amountIn);

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
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const tx = await router.swapExactTokensForTokens(
        amountInParsed,
        0,
        path,
        await signer.getAddress(),
        deadline
      );
      const receipt = await tx.wait();
      console.log("Second swap (wETH -> wXDAI) ) completed!", receipt);
      toast.success("Swap Back completed successfully.");
      // Wait for 5 seconds, then refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      toast.error("Swap failed");
    }
  };

  const handleSwap = async () => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    await swapTokens(amount, wxdaiAddress, wethAddress);
    await swapBackTokens(tokenAmount, wethAddress, wxdaiAddress);
  };

  return (
    <div className="container">
      <ToastContainer />
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
            <span>wXDAI</span>
          </div>
          <div className="balance-section">
            <p>WXDAI Balance: {nativeBalance} wXDAI</p>
          </div>
          <div className="input-section">
            <input
              type="number"
              placeholder="0.0"
              className="input-field"
              value={tokenAmount}
              disabled
            />
            <span>WETH</span>
          </div>
          <div className="balance-section">
            <p>WETH Balance: {wethBalance} wXDAI</p>
          </div>
          <button className="action-button" onClick={handleSwap}>
            Swap wXDAI for wETH
          </button>
        </div>
      )}
    </div>
  );
}

