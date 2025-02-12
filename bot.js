import { ethers } from "ethers";

// Connect to the Ethereum network
const provider = new ethers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/dKvu8kSJ1J1s60as-F3PfFr2cp6MAUCM"); //Change Netwrok URL because it's been disclosed

// Swap event signature
const swapEventSignature = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"; // Swap topic

// Create a filter for swap events
const filter = {
  topics: [swapEventSignature]
};

// Function to parse hex data to decimal values
function parseSwapLog(log) {
  const data = log.data.substring(2); // Remove '0x'
  const decoded = {
    amount0: ethers.toBigInt("0x" + data.substring(0, 64)).toString(),
    amount1: ethers.toBigInt("0x" + data.substring(64, 128)).toString(),
    sqrtPriceX96: ethers.toBigInt("0x" + data.substring(128, 192)).toString(),
    liquidity: ethers.toBigInt("0x" + data.substring(192, 256)).toString(),
    tick: ethers.toBigInt("0x" + data.substring(256, 320)).toString(),
  };
  return decoded;
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
