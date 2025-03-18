import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { default as Thead } from 'ui/shared/TheadSticky';

import OasysL2ChainDepositsTableItem from './OasysL2ChainDepositsTableItem';

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

// Define the props for the table item component
type TableItemProps = {
  item: ExtendedDepositsItem | ExtendedAddressDepositsItem | ExtendedBlockDepositsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
  key?: string; // Add key property
}

type Props = {
  top: number;
  isLoading?: boolean;
} & ({
  items: Array<ExtendedDepositsItem>;
  view: 'list';
} | {
  items: Array<ExtendedAddressDepositsItem>;
  view: 'address';
} | {
  items: Array<ExtendedBlockDepositsItem>;
  view: 'block';
});

const OasysL2ChainDepositsTable = ({ items, isLoading, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Table style={{ tableLayout: 'auto' }} minW="950px">
      <Thead top={ top }>
        <Tr>
          <Th minW="100px">L1 block No</Th>
          <Th minW="140px">L1 Txn hash</Th>
          { view !== 'address' && <Th w="25%">L1 txn origin</Th> }
          { view !== 'address' && <Th w="25%">To</Th> }
          { view !== 'block' && <Th w="25%">Age</Th> }
          <Th w="25%">{ `Value ${ feature.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { view === 'list' && (items as Array<ExtendedDepositsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <OasysL2ChainDepositsTableItem 
            key={ item.index + (isLoading ? String(index) : '') } 
            item={ item } 
            view="list" 
            isLoading={ isLoading }
          />
        )) }
        { view === 'address' && (items as Array<ExtendedAddressDepositsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <OasysL2ChainDepositsTableItem 
            key={ item.index + (isLoading ? String(index) : '') } 
            item={ item } 
            view="address" 
            isLoading={ isLoading }
          />
        )) }
        { view === 'block' && (items as Array<ExtendedBlockDepositsItem>).slice(0, renderedItemsNum).map((item, index) => (
          <OasysL2ChainDepositsTableItem 
            key={ item.index + (isLoading ? String(index) : '') } 
            item={ item } 
            view="block" 
            isLoading={ isLoading }
          />
        )) }
        <tr ref={ cutRef }/>
      </Tbody>
    </Table>
  );
};

export default OasysL2ChainDepositsTable;
