import { ChainId } from 'bridge/constants/types';

import { getEnvValue, getExternalAssetFilePath } from './utils';
import updatedTokens from '../networks/blockscout-updated-tokens.json';

// Define token interface
interface Token {
  address: string;
  name: string;
  symbol: string;
}

// Token list interface
interface TokenList {
  tokens: Token[];
}

// Initialize with default tokens from JSON file
let tokenList: TokenList = updatedTokens;

// Function to validate token data
const isValidTokenList = (data: unknown): data is TokenList => {
  return (
    typeof data === 'object' && 
    data !== null && 
    'tokens' in data && 
    Array.isArray((data as TokenList).tokens) &&
    (data as TokenList).tokens.every(token => 
      typeof token === 'object' && 
      token !== null && 
      'address' in token && 
      'name' in token && 
      'symbol' in token
    )
  );
};

// Function to fetch token list from external source
const fetchTokenList = async () => {
  try {
    // Get path to external asset file that was downloaded at build time
    const tokenFilePath = getExternalAssetFilePath('NEXT_PUBLIC_UPDATED_TOKENS');
    
    if (!tokenFilePath) {
      console.log('External token file path could not be determined, using default token list');
      return;
    }

    // Fetch the JSON file from the public directory
    const response = await fetch(tokenFilePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate the data structure
    if (isValidTokenList(data)) {
      tokenList = data;
      console.log('Token list loaded successfully from external source');
    } else {
      console.error('Invalid token list format from external source');
      console.log('Using default token list as fallback');
    }
  } catch (error) {
    console.error('Error loading token list from external source:', error);
    console.log('Using default token list as fallback');
  }
};

// Load tokens from external source in client environment
if (typeof window !== 'undefined') {
  // Execute token fetching when the module is loaded
  fetchTokenList();
}

// Function to find token by address
const findTokenByAddress = (address: string): Token | undefined => {
  if (!address) return undefined;
  
  const lowerCaseAddress = address.toLowerCase();
  return tokenList.tokens.find(token => 
    token.address.toLowerCase() === lowerCaseAddress
  );
};

export default Object.freeze({
  opNode: {
    isHiddenTxs: getEnvValue('NEXT_PUBLIC_HOMEPAGE_HIDDEN_OP_NODE_TXS') === 'true',
  },
  tokens: {
    // Provide token array from JSON for accessing all tokens when needed
    get all() {
      return tokenList.tokens;
    },
    // Function to find token by address
    findByAddress: findTokenByAddress,
  },
  bridge: {
    isVisible: getEnvValue('NEXT_PUBLIC_MENU_BRIDGE_VISIBLE') === 'true',
    l2ChainId: getEnvValue('NEXT_PUBLIC_L2_CHAIN_ID') || ChainId.TCG,
    verseVersion: getEnvValue('NEXT_PUBLIC_VERSE_VERSION'),
  },
  coinPrice: {
    isDisabled: getEnvValue('NEXT_PUBLIC_PRICE_TRACKER_DISABLE') === 'true',
  },
  experiment: {
    isVisible: getEnvValue('NEXT_PUBLIC_EXPERIMENT_VISIBLE') ? true : false,
    api: getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL'),
  },
});
