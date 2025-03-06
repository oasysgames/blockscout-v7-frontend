import { useCallback } from 'react';
import type { Address } from 'viem';
import { erc20Abi } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { usePublicClient, useWriteContract } from 'wagmi';

import type { ChainId } from '../constants/types';

export const useERC20Approve = (l1ChainId: ChainId) => {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient({ chainId: l1ChainId });

  const approve = useCallback(
    async(token: Address, chainId: number, amount: bigint, spender: Address) => {
      if (!client) {
        return;
      }

      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: token,
        chainId,
        functionName: 'approve',
        args: [ spender, amount ],
      });

      await waitForTransactionReceipt(client, { hash });
    },
    [ client, writeContractAsync ],
  );

  return approve;
};
