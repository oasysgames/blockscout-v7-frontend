import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const HOMEVerse = defineChain({
  id: ChainId.HOME,
  name: 'HOME Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.mainnet.oasys.homeverse.games' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'HOME Verse scan',
      url: 'https://explorer.oasys.homeverse.games',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x9245e19eB88de2534E03E764FB2a5f194e6d97AD',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.USDT]: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    [TokenIndex.TCGC]: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    [TokenIndex.MCHC]: '0x3e7eF8f50246f725885102E8238CBba33F276747',
    [TokenIndex.MARD]: '0xc8058960a9d7E7d81143BDBA38d19e6824165932',
    [TokenIndex.EPL]: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0',
    [TokenIndex.USDCeLegacy]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },
});
