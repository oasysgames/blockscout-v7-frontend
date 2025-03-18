import { Hide, Show, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useState, useEffect, useCallback } from 'react';

import config from 'configs/app';
import { rightLineArrow, nbsp } from 'lib/html-entities';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import OasysL2ChainDepositsListItem from 'ui/deposits/oasys/OasysL2ChainDepositsListItem';
import OasysL2ChainDepositsTable from 'ui/deposits/oasys/OasysL2ChainDepositsTable';
import { useBridgeEvents, EventType } from 'ui/experiment/services/useBridgeEvents';
import { useBridgeEventCounts } from 'ui/experiment/services/useBridgeEventCounts';
import { getChainName } from 'pages/withdrawals/index';

const ITEMS_PER_PAGE = 20;

// Extend the DepositsItem type to include our custom properties
interface ExtendedDepositsItem {
  index: number;
  validator_index: number;
  receiver: {
    hash: string;
    implementation_name: null;
    implementations: null;
    is_contract: boolean;
    is_verified: boolean;
    name: null;
    ens_domain_name: null;
    private_tags: null;
    public_tags: null;
    watchlist_names: any[];
  };
  amount: string;
  block_number: number;
  timestamp: string;
  tx_hash: string;
  // Custom properties to store the original values
  transactionHash?: string;
  chainName?: string;
}

// Define the props for the list item component
type ListItemProps = {
  item: ExtendedDepositsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
  key?: string; // Add key property
}

const OasysL2ChainDeposits = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventType, setEventType] = useState<EventType>('DEPOSIT');
  const [chainName, setChainName] = useState<string>('TCGVerse');

  useEffect(() => {
    if (chainName === null) {
      setChainName(getChainName());
    }
  }, [chainName]);

  const { data, isLoading, isError, pagination } = useBridgeEvents({
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    eventType,
    chainName,
  });

  const countersQuery = useBridgeEventCounts({
    eventType,
    chainName,
  });

  // Sử dụng useCallback để các hàm không bị tạo lại mỗi khi component re-render
  const handleNextPage = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prevPage => prevPage - 1);
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Transform bridge events to match the expected format for the components
  const transformedItems = data.map((event, idx) => {
    return {
      // Use blockNumber as index (must be number)
      index: parseInt(event.blockNumber) || 0,
      // Use a placeholder for validator_index
      validator_index: 0,
      receiver: {
        hash: event.to,
        implementation_name: null,
        implementations: null,
        is_contract: false,
        is_verified: false,
        name: null,
        ens_domain_name: null,
        private_tags: null,
        public_tags: null,
        watchlist_names: [],
      },
      amount: event.amount,
      block_number: parseInt(event.blockNumber) || 0,
      timestamp: event.timestamp,
      tx_hash: event.transactionHash,
      // Store the original values in custom properties
      transactionHash: event.transactionHash,
      chainName: event.chainName,
    } as ExtendedDepositsItem;
  });

  const content = transformedItems.length > 0 ? (
    <>
      <Show below="lg" ssr={ false }>
        { transformedItems.map(((item, index) => (
          <OasysL2ChainDepositsListItem
            key={ item.block_number + String(index) }
            item={ item }
            view="list"
            isLoading={ isLoading }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <OasysL2ChainDepositsTable
          items={ transformedItems }
          view="list"
          top={ pagination.hasNextPage || pagination.hasPreviousPage ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isLoading }
        />
      </Hide>
    </>
  ) : null;

  const text = (() => {
    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isLoading } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { BigNumber(countersQuery.data.withdrawal_count).toFormat() } deposits have been processed
            and { getCurrencyValue({ value: countersQuery.data.withdrawal_sum }).valueStr } { currencyUnits.ether } has been deposited
          </Text>
        ) }
      </Skeleton>
    );
  })();

  // Create a pagination object compatible with StickyPaginationWithText
  const paginationControl = {
    isVisible: pagination.hasNextPage || pagination.hasPreviousPage,
    currentPage: pagination.currentPage,
    onNextPageClick: handleNextPage,
    onPrevPageClick: handlePrevPage,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPreviousPage,
    page: pagination.currentPage,
    resetPage: resetPage,
    hasPages: pagination.hasNextPage || pagination.hasPreviousPage,
    canGoBackwards: pagination.hasPreviousPage,
    isLoading: isLoading,
  };

  const actionBar = <StickyPaginationWithText text={ text } pagination={ paginationControl }/>;

  return (
    <>
      <PageTitle title={ `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ transformedItems }
        emptyText="There are no deposits."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default OasysL2ChainDeposits;
