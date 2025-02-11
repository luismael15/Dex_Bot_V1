const { ethers } = require('ethers');
const WebSocket = require('ws');

// Replace with your Alchemy project ID
const ALCHEMY_PROJECT_ID = 'https://eth-mainnet.g.alchemy.com/v2/dKvu8kSJ1J1s60as-F3PfFr2cp6MAUCM';
const PRIVATE_KEY = 'fa097d0762b97cd20b75a459b7cbef781aff14246062599d0cfbefb1ee3b6315';
const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Ede1F18E0157C05861564'; // Uniswap V3 Router address
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH address
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48'; // USDC address

const provider = new ethers.providers.AlchemyProvider('homestead', PRIVATE_KEY);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const uniswapRouter = new ethers.Contract(
  UNISWAP_V3_ROUTER,
  ['event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'],
  wallet
);

async function main() {
  const ws = new WebSocket('wss://eth-mainnet.alchemyapi.io/v2/' + ALCHEMY_PROJECT_ID);

  ws.on('open', function open() {
    console.log('Connected to WebSocket');
    ws.send(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_subscribe',
      params: ['logs', {
        address: UNISWAP_V3_ROUTER,
        topics: ['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d44806f5c550856c7c77018a4d7b8229f5ec8c3a1aa2fb0c2ffd9ef5c971b196b'] // Swap event topic
      }]
    }));
  });

  ws.on('message', async function incoming(data) {
    const message = JSON.parse(data);
    if (message.method === 'eth_subscription' && message.params.result) {
      const log = message.params.result;
      const txHash = log.transactionHash;
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);
      const swapLog = receipt.logs.find(l => l.address.toLowerCase() === UNISWAP_V3_ROUTER.toLowerCase());

      if (swapLog) {
        const iface = new ethers.utils.Interface([
          'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
        ]);
        const decodedLog = iface.parseLog(swapLog);
        const amount0In = decodedLog.args.amount0In;
        const amount1In = decodedLog.args.amount1In;
        const amount0Out = decodedLog.args.amount0Out;
        const amount1Out = decodedLog.args.amount1Out;

        const price = amount1In.div(amount0Out);
        const time = new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' });
        console.log(`Time: ${time}, Pair: WETH/USDC, Price: ${price.toString()}`);
      }
    }
  });
}

main().catch(console.error);