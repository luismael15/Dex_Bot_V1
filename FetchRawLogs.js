import { JsonRpcProvider } from "ethers";
import { config } from './config.js';

// Connect to the Ethereum network
const provider = new JsonRpcProvider(config.Network_URL); // Set Network in the .env file

// Get logs
const filter = {};

const logs = await provider.getLogs(filter);

console.log(logs);