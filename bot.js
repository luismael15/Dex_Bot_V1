import { JsonRpcProvider } from "ethers";

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/dKvu8kSJ1J1s60as-F3PfFr2cp6MAUCM"); //Change Netwrok URL because it's been disclosed

// DEX contract address and Swap event signature
//const dexAddress = "0x6fF5693b99212Da76ad316178A184AB56D299b43"; // Uniswap V4:Universal router
const swapEventSignature = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"; // Swap topic

// Create a filter for swap events
const filter = {
  //
  topics: [swapEventSignature]
};

// Get logs
const logs = await provider.getLogs(filter);

console.log(logs);
