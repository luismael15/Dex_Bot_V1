import dotenv from 'dotenv';
dotenv.config();

export const config = {
  Network_URL: process.env.Network_URL,
  Network_URL_Websocket: process.env.Network_URL_Websocket,
  pools: [
    {
      name: "ETH_USDC_Uniswap_V3",
      address: process.env.ETH_USDC_Uniswap_V3_Pool,
      SwapEventSignature: process.env.SwapEventSignature
    },
    {
      name: "ETH_USDC_Aerodrome_Pool",
      address: process.env.ETH_USDC_Aerodrome_Pool,
      SwapEventSignature: process.env.SwapEventSignature
    },
    {
      name: "WETH_AERO_Uniswap_V3_Pool",
      address: process.env.WETH_AERO_Uniswap_V3_Pool,
      SwapEventSignature: process.env.SwapEventSignature
    },
    {
      name: "WETH_AERO_Aerodrome_Pool",
      address: process.env.WETH_AERO_Aerodrome_Pool,
      SwapEventSignature: process.env.SwapEventSignature
    }
  ],
};

