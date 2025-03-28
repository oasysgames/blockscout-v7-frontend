import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const SaakuruVerse = /*#__PURE__*/ defineChain({
  id: ChainId.SAAKURU,
  verseVersion: 1,
  name: 'Saakuru Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.saakuru.network' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Saakuru Verse scan',
      url: 'https://explorer.saakuru.network',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x4FfA6d5745C2E78361ae91a36312524284F3D812',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.USDT]: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2',
    [TokenIndex.TCGC]: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    [TokenIndex.MCHC]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    [TokenIndex.USDCeLegacy]: '0xD08a2917653d4E460893203471f0000826fb4034',
  },
});
