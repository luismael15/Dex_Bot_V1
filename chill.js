import { JsonRpcProvider } from "ethers";

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/dKvu8kSJ1J1s60as-F3PfFr2cp6MAUCM");

// Get logs
const filter = {};

const logs = await provider.getLogs(filter);

console.log(logs);