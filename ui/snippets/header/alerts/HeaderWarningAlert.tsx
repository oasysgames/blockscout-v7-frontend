import { Alert, AlertIcon, Box, CloseButton, Link, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import { getEnvValue } from 'configs/app/utils';

const HeaderWarningAlert = () => {
  const [ isAlertClosed, setIsAlertClosed ] = React.useState(false);
  const envValue = getEnvValue('NEXT_PUBLIC_HEADER_ALERT_ENABLED');
  const isEnabled = envValue === 'true';
  const explorerUrl = getEnvValue('NEXT_PUBLIC_HEADER_ALERT_EXPLORER_URL') || 'https://explorer.oasys.games/';
  const discordUrl = getEnvValue('NEXT_PUBLIC_HEADER_ALERT_DISCORD_URL') || 'https://discord.gg/8hfWTbKVex';

  const handleClose = React.useCallback(() => {
    setIsAlertClosed(true);
  }, []);

  if (isAlertClosed || !isEnabled) {
    return null;
  }

  return (
    <Alert status="warning" as={Box} borderRadius="12px">
      <AlertIcon alignSelf="flex-start" mt="4px"/>
      <Box flex="1" pr="40px">
        <Flex direction="column" gap={1}>
          <Box>
            Make sure you are visiting{' '}
            <Link href={explorerUrl} isExternal color="blue.600" display="inline-block" wordBreak="break-all">
              {explorerUrl}
            </Link>
          </Box>
          <Box>
            Oasys Official Discord is hacked! Join our new{' '}
            <Link href={discordUrl} isExternal color="blue.600" display="inline-block">
              server
            </Link>
          </Box>
        </Flex>
      </Box>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={handleClose}
      />
    </Alert>
  );
};

export default React.memo(HeaderWarningAlert);
