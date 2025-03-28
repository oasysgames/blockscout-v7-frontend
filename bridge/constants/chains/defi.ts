import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const DefiVerse = defineChain({
  id: ChainId.DEFI,
  name: 'DeFiVerse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.defi-verse.org' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'DeFiVerse scan',
      url: 'https://scan.defi-verse.org',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x0cc5366BE800cf73daB2DBfDE031C255a6f1E3cC',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.WETH]: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    [TokenIndex.WBTC]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    [TokenIndex.USDCe]: '0x7275B8DBAF919FDDa6eE6B36F12Fd25C0F193502',
    [TokenIndex.USDCeLegacy]: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2',
  },
});
