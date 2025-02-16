import dotenv from 'dotenv';
dotenv.config();

export const config = {
  Network_URL: process.env.Network_URL,
  ZBU_USDC_Base_Uniswap_Pool: process.env.ZBU_USDC_Base_Uniswap_Pool,
  USDC_cbBTC_Aerodrome_Pool: process.env.USDC_cbBTC_Aerodrome_Pool,
  USDC_cbBTC_Uniswap_V3_Pool: process.env.USDC_cbBTC_Uniswap_V3_Pool,
};

