export enum ChainId {
  OASYS = 248,
  TCG = 2400,
  SAAKURU = 7225878,
  MCH = 29548,
  XPLA = 7300,
  HOME = 19011,
  DEFI = 16116,
  YOOLDO = 50006,
  GEEK = 75512,
  CHAIN = 5555,
  GESO = 428,

  OASYS_TESTNET = 9372,
  SANDVERSE_TESTNET = 20197,
}

export interface ChainInfo {
  id: ChainId;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts?: {
    L1CrossDomainMessenger?: string;
    l1StandardBridge?: string;
  };
  isL1?: boolean;
}

export enum TokenIndex {
  OAS,
  USDT,
  TCGC,
  MCHC,
  DMT,
  TOTEM,
  MARD,
  EPL,
  CGG,
  WETH,
  WBTC,
  USDCe,
  GEEK,
  USDCeLegacy,
}

// ERC20
export interface TokenInfo {
  ind: TokenIndex;
  // token symbol
  symbol: string;
  // decimal
  decimal?: number;
  // image
  icon?: string;
}
