import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import Skeleton from 'ui/shared/chakra/Skeleton';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

// Extend the types to include our custom properties
interface ExtendedDepositsItem extends WithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedAddressDepositsItem extends AddressWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedBlockDepositsItem extends BlockWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

type Props = {
  item: ExtendedDepositsItem | ExtendedAddressDepositsItem | ExtendedBlockDepositsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
}

// Helper function to truncate long strings
const truncateMiddle = (str: string, startChars = 6, endChars = 4, separator = '...') => {
  if (str.length <= startChars + endChars) {
    return str;
  }
  
  const start = str.substring(0, startChars);
  const end = str.substring(str.length - endChars);
  
  return `${start}${separator}${end}`;
};

// Type guards
const hasBlockNumber = (item: any): item is { block_number: number } => 
  'block_number' in item;

const hasReceiver = (item: any): item is { receiver: any } => 
  'receiver' in item;

const hasTxHash = (item: any): item is { tx_hash: string } => 
  'tx_hash' in item;

const hasTimestamp = (item: any): item is { timestamp: string } => 
  'timestamp' in item;

// Helper function to convert timestamp from seconds to milliseconds if needed
const formatTimestamp = (timestamp: string): number => {
  // If timestamp is a numeric string and less than year 2100 in seconds (4102444800)
  // it's likely in seconds and needs to be converted to milliseconds
  const numericTimestamp = Number(timestamp);
  if (!isNaN(numericTimestamp) && numericTimestamp < 4102444800) {
    return numericTimestamp * 1000;
  }
  return numericTimestamp;
};

const OasysL2ChainDepositsTableItem = ({ item, view, isLoading }: Props) => {
  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <Tr>
      { !isBlock && hasBlockNumber(item) && (
        <Td>
          <BlockEntityL1
            number={ item.block_number }
            isLoading={ isLoading }
            fontSize="sm"
            lineHeight={ 5 }
          />
        </Td>
      ) }
      { !isAddress && (
        <Td>
          { item.transactionHash ? (
            <TxEntityL1
              isLoading={ isLoading }
              hash={ item.transactionHash }
              truncation="constant_long"
              noIcon
              fontSize="sm"
              lineHeight={ 5 }
            />
          ) : (
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              -
            </Skeleton>
          )}
        </Td>
      ) }
      { !isAddress && hasReceiver(item) && (
        <Td>
          <AddressEntityL1
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
            fontSize="sm"
            lineHeight={ 5 }
          />
        </Td>
      ) }
      { !isAddress && hasReceiver(item) && (
        <Td>
          <AddressEntity
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
            fontSize="sm"
            lineHeight={ 5 }
          />
        </Td>
      ) }
      { !isBlock && hasTimestamp(item) && (
        <Td>
          <TimeAgoWithTooltip
            timestamp={ formatTimestamp(item.timestamp) }
            isLoading={ isLoading }
            display="inline-block"
          />
        </Td>
      ) }
      <Td>
        <CurrencyValue value={ item.amount } currency={ currencyUnits.ether } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default OasysL2ChainDepositsTableItem;
