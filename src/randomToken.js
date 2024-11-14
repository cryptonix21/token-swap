// src/getRandomToken.js
export async function getRandomToken() {
  try {
    const response = await fetch("https://tokens.honeyswap.org/");
    const data = await response.json();

    // Check if tokens array exists
    if (!data.tokens || data.tokens.length === 0) {
      throw new Error("No tokens found in the token list.");
    }

    // Get a random token
    const randomIndex = Math.floor(Math.random() * data.tokens.length);
    return data.tokens[randomIndex];
  } catch (error) {
    console.error("Failed to fetch token list:", error);
    return null;
  }
}

