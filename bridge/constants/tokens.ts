import type { TokenInfo } from './types';
import { TokenIndex } from './types';

export const TOKEN_LIST: { [k in TokenIndex]: TokenInfo } = {
  // mainnet
  [TokenIndex.OAS]: {
    ind: TokenIndex.OAS,
    symbol: 'OAS',
    icon: '/images/tokens/OAS.png',
  },
  [TokenIndex.USDT]: {
    ind: TokenIndex.USDT,
    symbol: 'USDT',
    icon: '/images/tokens/USDT.png',
  },
  [TokenIndex.TCGC]: {
    ind: TokenIndex.TCGC,
    symbol: 'TCGC',
    icon: '/images/tokens/TCGC.png',
  },
  [TokenIndex.MCHC]: {
    ind: TokenIndex.MCHC,
    symbol: 'MCHC',
    icon: '/images/tokens/MCHC.png',
  },
  [TokenIndex.TOTEM]: {
    ind: TokenIndex.TOTEM,
    symbol: 'TOTEM',
    icon: '/images/tokens/TOTEM.png',
  },
  [TokenIndex.DMT]: {
    ind: TokenIndex.DMT,
    symbol: 'DMT',
    icon: '/images/tokens/DMT.png',
  },
  [TokenIndex.MARD]: {
    ind: TokenIndex.MARD,
    symbol: 'MARD',
    icon: '/images/tokens/MARD.png',
  },
  [TokenIndex.EPL]: {
    ind: TokenIndex.EPL,
    symbol: 'EPL',
    icon: '/images/tokens/EPL.png',
  },
  [TokenIndex.CGG]: {
    ind: TokenIndex.CGG,
    symbol: 'CGG',
    icon: '/images/tokens/CGG.png',
  },
  [TokenIndex.WETH]: {
    ind: TokenIndex.WETH,
    symbol: 'WETH',
    icon: '/images/tokens/OAS.png',
  },
  [TokenIndex.WBTC]: {
    ind: TokenIndex.WBTC,
    symbol: 'WBTC',
    icon: '/images/tokens/OAS.png',
  },
  [TokenIndex.USDCe]: {
    ind: TokenIndex.USDCe,
    symbol: 'USDC.e',
    icon: '/images/tokens/USDC.png',
  },
  [TokenIndex.GEEK]: {
    ind: TokenIndex.GEEK,
    symbol: 'GEEK',
    icon: '/images/tokens/OAS.png',
  },
  [TokenIndex.USDCeLegacy]: {
    ind: TokenIndex.USDCeLegacy,
    symbol: 'USDC.e-legacy',
    icon: '/images/tokens/USDC.png',
  },
};

export function getTokenInfo(tokenIndex: TokenIndex): TokenInfo {
  return TOKEN_LIST[tokenIndex];
}
