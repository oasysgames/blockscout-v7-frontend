import { defineChain } from 'viem';
import { oasisTestnet } from 'viem/chains';
import { chainConfig } from 'viem/op-stack';

import { ChainId } from '../types';

export const SandVerse = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: ChainId.SANDVERSE_TESTNET,
  name: 'Sand Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.sandverse.oasys.games' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Sand Verse scan',
      url: '',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS_TESTNET]: {
        address: '0xA16517A9796bAc73eFA7d07269F9818b7978dc2A',
      },
    },
  },
});

export const OasysTestnet = defineChain({
  ...oasisTestnet,
  id: ChainId.OASYS_TESTNET,
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.testnet.oasys.games' ],
    },
    'public': {
      http: [ 'https://rpc.testnet.oasys.games' ],
    },
  },
  contracts: {
    ...oasisTestnet.contracts,
    multicall3: {
      address: '0xCC65BeF5A01140a6fc7eEf4Bd6967228B6137e4b',
    },
  },
});
