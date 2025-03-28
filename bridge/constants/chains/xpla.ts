import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId } from '../types';

export const XPLAVerse = defineChain({
  id: ChainId.XPLA,
  name: 'XPLA Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc-xpla-verse.xpla.dev/' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'XPLA Verse scan',
      url: 'https://explorer-xpla-verse.xpla.dev',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x80d7aAB75B4144AF77E04C1A334e7236Be4771d0',
      },
    },
  },
});
