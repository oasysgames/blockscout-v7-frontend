export const ERC721_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)'
];

export const PORTAL_ABI = [
  'event DepositTransactionCreated(address indexed from, address indexed to, uint256 value, bytes data)',
  'event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes data)'
];

export const L1_BRIDGE_ABI = [
  'event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes data)'
]; 