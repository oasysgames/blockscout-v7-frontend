import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId } from '../types';

export const GesoVerse = defineChain({
  id: ChainId.GESO,
  name: 'GESO Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.verse.gesoten.com/' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'GESO Verse scan',
      url: 'https://explorer.verse.gesoten.com/',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x9F740B3E8E823E68294eEA69299908E3FdEe1Ea7',
      },
    },
  },
});
