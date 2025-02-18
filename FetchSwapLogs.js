import { ethers } from "ethers";
import { config } from './config.js';
import { fetchPoolTokens } from './FetchPoolTokens.js'; // Import FetchPoolTokens

// Connect to the network using WebSocketProvider
const provider = new ethers.WebSocketProvider(config.Network_URL_Websocket);

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

// Function to subscribe to swap events for a specific pool
async function subscribeToSwapEvents(pool) {
    try {
        console.log(`Subscribing to Swap events on pool: ${pool.name}`);
        // Fetch token details
        const { token0, token1 } = await fetchPoolTokens(pool.address);
        provider.on({
            address: pool.address,
            topics: [pool.SwapEventSignature] // Use the SwapEventSignature from pool
        }, (log) => {
            const parsedLog = parseSwapLog(log);
            const amount0 = ethers.formatUnits(parsedLog.amount0, token0.decimals);
            const amount1 = ethers.formatUnits(parsedLog.amount1, token1.decimals);

            // Calculate the price of token1/token0 in absolute numbers
            const price = Math.abs(parseFloat(amount1) / parseFloat(amount0));

            console.log(`New Swap Event on pool: ${pool.name}`);
            console.log(`Price (${token1.symbol}/${token0.symbol}): ${price}`);
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
        // Subscribe to each pool in the config
        config.pools.forEach(pool => {
            subscribeToSwapEvents(pool);
        });
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
