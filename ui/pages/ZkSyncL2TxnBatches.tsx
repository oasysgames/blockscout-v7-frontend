import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { generateListStub } from 'stubs/utils';
import { ZKSYNC_L2_TXN_BATCHES_ITEM } from 'stubs/zkSyncL2';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import ZkSyncTxnBatchesListItem from 'ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesListItem';
import ZkSyncTxnBatchesTable from 'ui/txnBatches/zkSyncL2/ZkSyncTxnBatchesTable';

const ZkSyncL2TxnBatches = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'zksync_l2_txn_batches',
    options: {
      placeholderData: generateListStub<'zksync_l2_txn_batches'>(
        ZKSYNC_L2_TXN_BATCHES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            number: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('zksync_l2_txn_batches_count', {
    queryOptions: {
      placeholderData: 5231746,
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <ZkSyncTxnBatchesListItem
            key={ item.number + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <ZkSyncTxnBatchesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton isLoaded={ !countersQuery.isPlaceholderData && !isPlaceholderData } display="flex" flexWrap="wrap">
        Txn batch
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[0].number } </Text>to
        <Text fontWeight={ 600 } whiteSpace="pre"> #{ data.items[data.items.length - 1].number } </Text>
        (total of { countersQuery.data?.toLocaleString() } batches)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Txn batches" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no txn batches."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default ZkSyncL2TxnBatches;
