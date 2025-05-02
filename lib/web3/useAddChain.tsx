import { get } from 'es-toolkit/compat';
import React from 'react';
import type { AddEthereumChainParameter } from 'viem';

import config from 'configs/app';
import getErrorObj from 'lib/errors/getErrorObj';

import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

function getParams(): AddEthereumChainParameter {
  if (!config.chain.id) {
    throw new Error('Missing required chain config');
  }

  return {
    chainId: getHexadecimalChainId(Number(config.chain.id)),
    chainName: config.chain.name ?? '',
    nativeCurrency: {
      name: config.chain.currency.name ?? '',
      symbol: config.chain.currency.symbol ?? '',
      decimals: config.chain.currency.decimals ?? 18,
    },
    rpcUrls: config.chain.rpcUrls,
    blockExplorerUrls: [ config.app.baseUrl ],
  };
}

export default function useAddChain() {
  const { wallet, provider } = useProvider();

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    try {
      return await provider.request({
        method: 'wallet_addEthereumChain',
        params: [ getParams() ],
      });
    } catch (error) {
      const errorObj = getErrorObj(error);
      const code = get(errorObj, 'code');
      const message = get(errorObj, 'message');
      const originalErrorCode = get(errorObj, 'data.originalError.code');
      if (code === -32603 && message === 'f is not a function') {
        console.warn('Chain already added or not supported');
        return;
      }

      // Throw error
      if (code !== -32603 || originalErrorCode !== -32603) {
        throw error;
      }
    }
  }, [ wallet, provider ]);
}
