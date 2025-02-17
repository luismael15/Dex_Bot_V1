import dotenv from 'dotenv';
dotenv.config();

export const config = {
  Network_URL: process.env.Network_URL,
  Network_URL_Websocket: process.env.Network_URL_Websocket,
  pools:[
    {
      name: "ETH_USDC_Uniswap_V3",
      address: '0x8ad599c3a0ff1fc8bc63e6548154d6c6b7796886',
      SwapEventSignature: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67'
    },
    {
      name: "ETH_USDC_Aerodrome",
      address: '0xd0b53D9277642d899DF5C87A3966A349A798F224',
      SwapEventSignature: '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67'
    },
  ]
};

