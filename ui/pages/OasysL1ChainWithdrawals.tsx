import { Hide, Show, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import BeaconChainWithdrawalsListItem from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsListItem';
import BeaconChainWithdrawalsTable from 'ui/withdrawals/beaconChain/BeaconChainWithdrawalsTable';
import { useBridgeEvents } from 'ui/experiment/services/useBridgeEvents';

const feature = config.features.beaconChain;

const Withdrawals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, pagination } = useBridgeEvents({
    page: currentPage,
    itemsPerPage: 20,
  });

  const countersQuery = useApiQuery('withdrawals_counters', {
    queryOptions: {
      placeholderData: {
        withdrawal_count: '19091878',
        withdrawal_sum: '4630710684332438',
      },
    },
  });

  // Transform bridge events to match the expected format for the components
  const transformedItems = data.map(event => ({
    index: event.transactionHash, // Using transactionHash as a unique identifier
    validator_index: event.from,
    address: event.to,
    amount: event.amount,
    block_number: event.blockNumber,
    timestamp: event.timestamp,
    tx_hash: event.transactionHash,
  }));

  const content = transformedItems.length > 0 ? (
    <>
      <Show below="lg" ssr={ false }>
        { transformedItems.map(((item, index) => (
          <BeaconChainWithdrawalsListItem
            key={ item.index + String(index) }
            item={ item }
            view="list"
            isLoading={ isLoading }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <BeaconChainWithdrawalsTable
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
            { BigNumber(countersQuery.data.withdrawal_count).toFormat() } withdrawals processed
            and { getCurrencyValue({ value: countersQuery.data.withdrawal_sum }).valueStr } { currencyUnits.ether } withdrawn
          </Text>
        ) }
      </Skeleton>
    );
  })();

  // Create a pagination object compatible with StickyPaginationWithText
  const paginationControl = {
    isVisible: pagination.hasNextPage || pagination.hasPreviousPage,
    currentPage: pagination.currentPage,
    onNextPageClick: () => setCurrentPage(currentPage + 1),
    onPrevPageClick: () => setCurrentPage(currentPage - 1),
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPreviousPage,
  };

  const actionBar = <StickyPaginationWithText text={ text } pagination={ paginationControl }/>;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } withdrawals` : 'Withdrawals' }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        items={ transformedItems }
        emptyText="There are no withdrawals."
        content={ content }
        actionBar={ actionBar }
        isLoading={ isLoading }
      />
    </>
  );
};

export default Withdrawals;
