import { ChainId } from 'bridge/constants/types';

import { getEnvValue } from './utils';

export default Object.freeze({
  opNode: {
    isHiddenTxs: getEnvValue('NEXT_PUBLIC_HOMEPAGE_HIDDEN_OP_NODE_TXS') === 'true',
  },
  tokens: {
    updatedAddress: getEnvValue('NEXT_PUBLIC_TOKENS_UPDATED_ADDRESS') || '',
    updatedName: getEnvValue('NEXT_PUBLIC_TOKENS_UPDATED_NAME') || 'Oasys',
    updatedSymbol: getEnvValue('NEXT_PUBLIC_TOKENS_UPDATED_SYMBOL') || 'OAS',
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
    isVisible: getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL') ? true : false,
  },
});
