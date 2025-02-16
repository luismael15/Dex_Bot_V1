import { ethers } from "ethers";
import { config } from './config.js';

// Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider(config.Network_URL); // Set Network in the .env file

// ERC20 token ABI (only relevant functions)
const ERC20_ABI = [
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
  ];
  
  // Uniswap V3 pool ABI (only relevant functions)
  const UNISWAP_V3_POOL_ABI = [
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ];
  
  async function fetchPoolTokens(poolAddress) {
    try {
      const poolContract = new ethers.Contract(poolAddress, UNISWAP_V3_POOL_ABI, provider);
      
      const token0Address = await poolContract.token0();
      const token1Address = await poolContract.token1();
      
      const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, provider);
      const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, provider);
      
      const [symbol0, decimals0, symbol1, decimals1] = await Promise.all([
        token0Contract.symbol(),
        token0Contract.decimals(),
        token1Contract.symbol(),
        token1Contract.decimals()
      ]);
      
      console.log("Pool Address:", poolAddress);
      console.log("Token 0:", { address: token0Address, symbol: symbol0, decimals: decimals0 });
      console.log("Token 1:", { address: token1Address, symbol: symbol1, decimals: decimals1 });
    } catch (error) {
      console.error("Error fetching pool tokens:", error);
    }
  }
  
  // Example usage
  const poolAddress = "0x021235b92A4F52C789F43a1B01453c237C265861"; // Replace with an actual pool address
  fetchPoolTokens(poolAddress);