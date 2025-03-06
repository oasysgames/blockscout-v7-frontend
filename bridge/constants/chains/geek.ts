import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const GeekVerse = defineChain({
  id: ChainId.GEEK,
  verseVersion: 1,
  name: 'Geek Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.geekout-pte.com' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Geek Verse scan',
      url: 'https://explorer.geekout-pte.com/',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x62Ec33Ea441d654008d5E631D11B6A3cb7034e31',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.GEEK]: '0x3741FcB5792673eF220cCc0b95B5B8C38c5f2723',
  },
});
