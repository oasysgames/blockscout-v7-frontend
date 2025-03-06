import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const ChainVerse = defineChain({
  id: ChainId.CHAIN,
  name: 'Chain Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.chainverse.info/' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Chain Verse scan',
      url: 'https://explorer.chainverse.info/',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x24d133Df1d72089809945EC9550f72f8415AC780',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.USDT]: '0xD08a2917653d4E460893203471f0000826fb4034',
    [TokenIndex.TCGC]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    [TokenIndex.MCHC]: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    [TokenIndex.CGG]: '0x26AA9B3D8A49A2ed849Ac66EA9AA37Ee36Bc6b24',
    [TokenIndex.USDCeLegacy]: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
  },
});
