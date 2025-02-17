import { ethers } from "ethers";
import { config } from './config.js';
import { fetchPoolTokens } from './FetchPoolTokens.js'; // Import FetchPoolTokens

// Connect to the network using WebSocketProvider
const provider = new ethers.WebSocketProvider(config.Network_URL_Websocket);

// Swap event signature and pool address from config
const EventSignature = config.SwapEventSignature;
const swapAddress = config.ETH_USDC_Uniswap_V3_Pool;

// Function to convert hex data to signed integers
function toSignedInt(hex, bitSize) {
    let value = ethers.toBigInt(hex);
    const maxUnsigned = BigInt(2) ** BigInt(bitSize); // Max value for the given bit size
    const maxSigned = maxUnsigned / BigInt(2); // Max positive signed value
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
        tick: toSignedInt("0x" + data.substring(256, 320), 256), // Signed 32-bit
    };
}

// Function to subscribe to swap events (called *after* the connection is open)
async function subscribeToSwapEvents() {
    try {
        console.log(`Subscribing to Swap events on pool: ${swapAddress}`);

        // Fetch token details
        const { token0, token1 } = await fetchPoolTokens(swapAddress);

        provider.on({
            address: swapAddress,
            topics: [EventSignature]
        }, (log) => {
            console.log("New Swap Event:");
            const parsedLog = parseSwapLog(log);
            console.log("Parsed Log:", parsedLog);
            console.log("Transaction Hash:", log.transactionHash);

            //Display Amount with Decimals
            const amount0 = ethers.formatUnits(parsedLog.amount0, token0.decimals);
            const amount1 = ethers.formatUnits(parsedLog.amount1, token1.decimals);

            console.log(`Amount0 (${token0.symbol}): ${amount0}`);
            console.log(`Amount1 (${token1.symbol}): ${amount1}`);

            //Include Block Number
            console.log(`Block Number: ${log.blockNumber}`);

            // **IMPORTANT:** Trigger your arbitrage logic here, using the parsedLog data
            // Example:
            // analyzeSwapAndExecute(parsedLog);
        });

        console.log("Successfully subscribed to swap events.");
    } catch (error) {
        console.error("Error subscribing to events:", error);
    }
}

// Function to handle WebSocket connection and setup
async function connectWebSocket() {
    provider.websocket.on("open", () => { // Changed to provider.websocket.on
        console.log("WebSocket connection established!");
        subscribeToSwapEvents(); // Call the subscription function *after* open
    });

    provider.websocket.on("close", (code, reason) => { // Changed to provider.websocket.on
        console.log(`WebSocket connection closed: code=${code}, reason=${reason}`);
        console.log("Attempting to reconnect in 5 seconds...");
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
    });

    provider.websocket.on("error", (error) => { // Changed to provider.websocket.on
        console.error("WebSocket error:", error);
    });
}

// Start the WebSocket connection process
connectWebSocket();
