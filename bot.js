import { ethers } from "ethers";
import { config } from './config.js';

// Connect to the network
const provider = new ethers.JsonRpcProvider(config.Network_URL); // Set Network in the .env file

// Swap event signature
const swapEventSignature = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"; // Swap topic
//Swap pool Address
const swapAddress = "0x021235b92A4F52C789F43a1B01453c237C265861"; // Swap address

// Create a filter for swap events
const filter = {
  address: [swapAddress],
  topics: [swapEventSignature]
};

// Function to convert hex data to signed integers
function toSignedInt(hex, bitSize) {
  let value = ethers.toBigInt(hex);
  const maxUnsigned = BigInt(2) ** BigInt(bitSize);  // Max value for the given bit size
  const maxSigned = maxUnsigned / BigInt(2); // Max positive signed value

  // If value is greater than or equal to maxSigned, it means it's negative
  if (value >= maxSigned) {
    value -= maxUnsigned;
  }
  return value.toString();
}

// Function to parse hex data to decimal values
function parseSwapLog(log) {
  const data = log.data.substring(2); // Remove '0x'

  return {
    amount0: toSignedInt("0x" + data.substring(0, 64), 256), // Signed 256-bit
    amount1: toSignedInt("0x" + data.substring(64, 128), 256), // Signed 256-bit
    sqrtPriceX96: ethers.toBigInt("0x" + data.substring(128, 192)).toString(), // Always positive
    liquidity: ethers.toBigInt("0x" + data.substring(192, 256)).toString(), // Always positive
    tick: toSignedInt("0x" + data.substring(256, 320), 256), // ✅ FIXED: Signed 32-bit
  };
}

// Fetch logs and decode them
async function fetchAndDecodeLogs() {
  try {
    const logs = await provider.getLogs(filter);
    const parsedLogs = logs.map(log => ({
      transactionHash: log.transactionHash,
      blockNumber: log.blockNumber,
      parsedData: parseSwapLog(log),
    }));

    console.log(parsedLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
  }
}

fetchAndDecodeLogs();