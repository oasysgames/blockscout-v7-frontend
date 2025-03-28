import type { Address } from 'viem';
import type { Chain } from 'viem/chains';

import { ChainId, TokenIndex } from '../types';

import { ChainVerse } from './chain';
import { DefiVerse } from './defi';
import { GeekVerse } from './geek';
import { GesoVerse } from './geso';
import { HOMEVerse } from './home';
import { MCHVerse } from './mch';
import { Oasys } from './oasys';
import { SaakuruVerse } from './saakuru';
import { OasysTestnet, SandVerse } from './sand';
import { TCGVerse } from './tcg';
import { XPLAVerse } from './xpla';
import { YooldoVerse } from './yooldo';

export const CHAINS: { [k in ChainId]: Chain } = {
  [ChainId.OASYS]: Oasys,
  [ChainId.OASYS_TESTNET]: OasysTestnet,
  [ChainId.SANDVERSE_TESTNET]: SandVerse,
  [ChainId.TCG]: TCGVerse,
  [ChainId.MCH]: MCHVerse,
  [ChainId.SAAKURU]: SaakuruVerse,
  [ChainId.XPLA]: XPLAVerse,
  [ChainId.HOME]: HOMEVerse,
  [ChainId.DEFI]: DefiVerse,
  [ChainId.YOOLDO]: YooldoVerse,
  [ChainId.GEEK]: GeekVerse,
  [ChainId.CHAIN]: ChainVerse,
  [ChainId.GESO]: GesoVerse,
};

export const L2MainnetChainIds = [
  ChainId.TCG,
  ChainId.MCH,
  ChainId.SAAKURU,
  ChainId.XPLA,
  ChainId.HOME,
  ChainId.DEFI,
  ChainId.YOOLDO,
  ChainId.GEEK,
  ChainId.CHAIN,
  ChainId.GESO,
];

export function getChainInfo(ind: ChainId): Chain {
  const chain = CHAINS[ind];

  return chain;
}

export {
  Oasys,
  OasysTestnet,
  SandVerse,
  TCGVerse,
  MCHVerse,
  SaakuruVerse,
  XPLAVerse,
  HOMEVerse,
  DefiVerse,
  YooldoVerse,
  GeekVerse,
  ChainVerse,
  GesoVerse,
};

interface ChainWithERC20Address {
  erc20Addresses?: Partial<{ [k in TokenIndex]: Address }>;
}

export function getTokenAddress(chainId: ChainId, tokenIndex: TokenIndex): Address | undefined {
  const chainErc20Addresses =
		(getChainInfo(chainId) as ChainWithERC20Address).erc20Addresses || {};

  return chainErc20Addresses[tokenIndex];
}

export function getTokenList(
  l1ChainId: ChainId,
  l2ChainId: ChainId,
  excludeTokens: Array<TokenIndex> = [],
): Array<TokenIndex> {
  // TODO check l1ChainId is l1, l2ChainId is l2
  const list: Array<TokenIndex> = [ TokenIndex.OAS ];

  const l1Erc20Addresses = (getChainInfo(l1ChainId) as ChainWithERC20Address).erc20Addresses || {};
  const l2Erc20Addresses = (getChainInfo(l2ChainId) as ChainWithERC20Address).erc20Addresses || {};

  const l1TokenIndexes = Object.keys(l1Erc20Addresses).map((k) => Number(k) as TokenIndex);

  for (const tokenIndex of l1TokenIndexes) {
    if (
      !excludeTokens.includes(tokenIndex) &&
			l1Erc20Addresses[tokenIndex] &&
			l2Erc20Addresses[tokenIndex]
    ) {
      list.push(tokenIndex);
    }
  }

  return list;
}

interface ChainWithVerseVersion {
  verseVersion?: 0 | 1
}

export function getVerseVersion(chainId: ChainId) {
  return (getChainInfo(chainId) as ChainWithVerseVersion).verseVersion
}
