import { ChainId } from './types';

export const CHAINS_ICONS: { [k in ChainId]: string } = {
  [ChainId.OASYS]: '/images/Oasys.png',
  [ChainId.OASYS_TESTNET]: '/images/Oasys.png',
  [ChainId.SANDVERSE_TESTNET]: 'SandVerse',
  [ChainId.TCG]: '/images/tcg.svg',
  [ChainId.MCH]: '/images/mch.svg',
  [ChainId.SAAKURU]: '/images/saakuru.svg',
  [ChainId.XPLA]: '/images/xpla.png',
  [ChainId.HOME]: '/images/home.png',
  [ChainId.DEFI]: '/images/defi.jpeg',
  [ChainId.YOOLDO]: '/images/yooldo.png',
  [ChainId.GEEK]: '/images/geek.jpg',
  [ChainId.CHAIN]: '/images/chain.svg',
  [ChainId.GESO]: '/images/geso.svg',
};

export function getChainIcon(chainId: ChainId): string {
  return CHAINS_ICONS[chainId];
}
