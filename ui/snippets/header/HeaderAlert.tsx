import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingBlocksAlert from './alerts/IndexingBlocksAlert';
import MaintenanceAlert from './alerts/MaintenanceAlert';
import HeaderWarningAlert from './alerts/HeaderWarningAlert';

const HeaderAlert = () => {
  return (
    <Flex flexDir="column" rowGap={ 3 } mb={ 3 } _empty={{ display: 'none' }}>
      <HeaderWarningAlert/>
      <MaintenanceAlert/>
      <IndexingBlocksAlert/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
