import { useCallback, useEffect, useState } from 'react';
import type { Address, ChainContract } from 'viem';
import { parseUnits } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useWriteContract, useSwitchChain, useAccount, usePublicClient } from 'wagmi';

import { ChainId, TokenIndex } from '../constants/types';

import { l1StandardBridgeAbi, l2StandardBridgeAbi } from '../constants/abis';
import { getChainInfo, getTokenAddress } from '../constants/chains';
import { useERC20Approve } from './useERC20Approve';

type UseDepositWithdrawReturn = [
  (l1ChainId: ChainId, l2ChainId: ChainId, tokenInd: TokenIndex, amount: string) => Promise<void>,
  (l1ChainId: ChainId, l2ChainId: ChainId, tokenInd: TokenIndex, amount: string) => Promise<void>,
  boolean, // isLoading
  string | undefined, // tx hash
  string | undefined, // error message
]

// for Withdraw
const l2StandardBridgeAddr = '0x4200000000000000000000000000000000000010';
const l2OASLegacyAddr = '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000';

export function useDepositWithdraw(verseVersion: 0 | 1, chainId: number): UseDepositWithdrawReturn {
  const { writeContractAsync, data: hash, error } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const client = usePublicClient({ chainId });

  const [ isLoading, setIsLoading ] = useState(false);

  const { address } = useAccount();

  const approve = useERC20Approve(chainId);

  // Deposit
  const deposit = useCallback(
    async(l1ChainId: ChainId, l2ChainId: ChainId, tokenInd: TokenIndex, amount: string) => {
      if (!address) {
        return;
      }

      const l2Chain = getChainInfo(l2ChainId);

      // ensure using the correct chain (when the current chain not recognized correctly)
      await switchChainAsync({ chainId: l1ChainId });

      // start loading
      setIsLoading(true);

      // amount
      const parsedAmount = parseUnits(amount ?? '0', 18);

      const l1StandardBridge = l2Chain.contracts?.l1StandardBridge as {
        [sourceId: number]: ChainContract;
      };
      const l1StandardBridgeAddr = l1StandardBridge[l1ChainId].address;

      // send transaction
      if (tokenInd === TokenIndex.OAS) {
        await writeContractAsync({
          address: l1StandardBridgeAddr, //'0x',
          value: parsedAmount,
          abi: l1StandardBridgeAbi,
          functionName: 'depositETH',
          args: [ parseUnits('2', 6), '0x' ],
          account: address,
        });
      } else {
        // depositERC20To
        const l1Address = getTokenAddress(l1ChainId, tokenInd);
        const l2Address = getTokenAddress(l2ChainId, tokenInd);

        const hash = await approve(
          l1Address as Address,
          l1ChainId,
          parsedAmount,
          l1StandardBridgeAddr,
        );

        await writeContractAsync({
          address: l1StandardBridgeAddr, //'0x',
          abi: l1StandardBridgeAbi,
          functionName: 'depositERC20',
          args: [ l1Address, l2Address, parsedAmount, parseUnits('2', 6), '0x' ],
          account: address,
        });
      }
    },
    [ address, chainId, switchChainAsync, writeContractAsync, approve ],
  );

  // Withdraw
  const withdraw = useCallback(
    async(l1ChainId: ChainId, l2ChainId: ChainId, tokenInd: TokenIndex, amount: string) => {
      if (!address) {
        return;
      }

      // ensure using the correct chain (when the current chain not recognized correctly)
      await switchChainAsync({ chainId: l2ChainId });

      const parsedAmount = parseUnits(amount ?? '0', 18);

      setIsLoading(true);

      const isNative = tokenInd === TokenIndex.OAS;
      const l2TokenAddr = isNative ? l2OASLegacyAddr : getTokenAddress(l2ChainId, tokenInd);

      // send transaction
      await writeContractAsync({
        address: l2StandardBridgeAddr, //'0x',
        abi: l2StandardBridgeAbi,
        functionName: 'withdraw',
        // in case native token and verse v1, need to pass value
        value: isNative && verseVersion ? parsedAmount : BigInt(0),
        args: [ l2TokenAddr, parsedAmount, 0, '0x' ],
        account: address,
      });
    },
    [ address, chainId, switchChainAsync, writeContractAsync ],
  );

  useEffect(() => {
    if (client && hash) {
      (async() => {
        await waitForTransactionReceipt(client, { hash });
        setIsLoading(false);
      })();
    }
    if (error) {
      setIsLoading(false);
    }
  }, [ client, hash, error ]);

  return [ deposit, withdraw, isLoading, hash, error?.message ];
}
