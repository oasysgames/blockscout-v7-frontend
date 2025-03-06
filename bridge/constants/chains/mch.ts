import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const MCHVerse = /*#__PURE__*/ defineChain({
  id: ChainId.MCH,
  name: 'MCH Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.oasys.mycryptoheroes.net' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'MCH Verse scan',
      url: 'https://explorer.oasys.mycryptoheroes.net',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0xA16517A9796bAc73eFA7d07269F9818b7978dc2A',
      },
    },
  },
  erc20Addresses: {
    [TokenIndex.USDT]: '0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2',
    [TokenIndex.TCGC]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    [TokenIndex.MCHC]: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    [TokenIndex.USDCeLegacy]: '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
  },
});
