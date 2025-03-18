import { Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';

import OasysL2ChainDepositsListItem from './OasysL2ChainDepositsListItem';

type Props = {
  isLoading?: boolean;
} & ({
  items: Array<WithdrawalsItem>;
  view: 'list';
} | {
  items: Array<AddressWithdrawalsItem>;
  view: 'address';
} | {
  items: Array<BlockWithdrawalsItem>;
  view: 'block';
});

const DepositsList = ({ items, view, isLoading }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => {

        const key = item.index + (isLoading ? String(index) : '');

        switch (view) {
          case 'address': {
            return (
              <OasysL2ChainDepositsListItem
                key={ key }
                item={ item as AddressWithdrawalsItem }
                view={ view }
                isLoading={ isLoading }
              />
            );
          }
          case 'block': {
            return (
              <OasysL2ChainDepositsListItem
                key={ key }
                item={ item as BlockWithdrawalsItem }
                view={ view }
                isLoading={ isLoading }
              />
            );
          }
          case 'list': {
            return (
              <OasysL2ChainDepositsListItem
                key={ key }
                item={ item as WithdrawalsItem }
                view={ view }
                isLoading={ isLoading }
              />
            );
          }
        }
      }) }
      <div ref={ cutRef }/>
    </Box>
  );
};

export default React.memo(DepositsList);
