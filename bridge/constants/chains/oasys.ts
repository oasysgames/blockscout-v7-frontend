import { defineChain } from 'viem';
import { oasys } from 'viem/chains';

import { ChainId, TokenIndex } from '../types';

export const Oasys = defineChain({
  ...oasys,
  id: ChainId.OASYS,
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.mainnet.oasys.games' ],
    },
  },
  erc20Addresses: {
    [TokenIndex.USDT]: '0xDc3af65eCBD339309Ec55F109CB214E0325c5eD4',
    [TokenIndex.TCGC]: '0xdDB07cc0f2F9fB7899DbA5a21964f3C6D2740e44',
    [TokenIndex.MCHC]: '0x5B1CC635E524cAbb63a581c050C895534755F297',
    [TokenIndex.TOTEM]: '0x32be98D11DfE4E785165F20C9322E8d5E329b1ED',
    [TokenIndex.DMT]: '0xbC90a51557A7449De96eCD6D4147818E009b384d',
    [TokenIndex.MARD]: '0x06Cf9906bbaD4C065e610AdD988A026995273e0b',
    [TokenIndex.EPL]: '0xd2e426eA2fFa72DD1DC75e7bD148fb959E3E04b2',
    [TokenIndex.CGG]: '0x07A27F90707Ef989C1614a5660f84bCFb535C4B6',
    [TokenIndex.WETH]: '0x5801E5a61164024Be2554248E33127c6ebC8C113',
    [TokenIndex.WBTC]: '0xdd30c42D57a0f14DD44c809F59836D57392FDbC9',
    [TokenIndex.USDCe]: '0x4D17C0609B77e456Fb98Ea99a62bCeF09adae32D',
    [TokenIndex.GEEK]: '0x7CF763C9Ff650BF9e2EEbEE43bBC539c799d4566',
    [TokenIndex.USDCeLegacy]: '0xE1aB220E37AC55A4E2dD5Ba148298A9c09fBD716',
  },
});
