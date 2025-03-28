import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import Skeleton from 'ui/shared/chakra/Skeleton';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

const feature = config.features.beaconChain;

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

const OasysL2ChainDepositsListItem = ({ item, view, isLoading }: Props) => {
  if (!feature.isEnabled) {
    return null;
  }

  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <ListItemMobileGrid.Container>
      { !isBlock && hasBlockNumber(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block No</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BlockEntityL1
              number={ item.block_number }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !isAddress && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { item.transactionHash ? (
              <TxEntityL1
                isLoading={ isLoading }
                hash={ item.transactionHash }
                truncation="constant_long"
                noIcon
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 600 }
              />
            ) : (
              <Skeleton isLoaded={ !isLoading } display="inline-block" fontWeight={ 600 }>
                -
              </Skeleton>
            )}
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !isAddress && hasReceiver(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn origin</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntityL1
              address={ item.receiver }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }
      { !isAddress && hasReceiver(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }
      { !isBlock && hasTimestamp(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeAgoWithTooltip
              timestamp={ formatTimestamp(item.timestamp) }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <>
        <ListItemMobileGrid.Label isLoading={ isLoading }>Amount</ListItemMobileGrid.Label>
        <ListItemMobileGrid.Value>
          <CurrencyValue value={ item.amount } currency={ currencyUnits.ether } isLoading={ isLoading }/>
        </ListItemMobileGrid.Value>
      </>
    </ListItemMobileGrid.Container>
  );
};

export default OasysL2ChainDepositsListItem;
