import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { useSwitchChain } from 'wagmi';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

import { ChainId, TokenIndex } from './constants/types';

import { CHAINS, getTokenList, getVerseVersion } from './constants/chains';
import { getTokenInfo } from './constants/tokens';
import { getChainIcon } from './constants/verseicons';
import { useBalances } from './hooks/useBalances';
import { useDepositWithdraw } from './hooks/useDepositWithdraw';
import { LoadingIcon, LoadingModal } from './LoadingModal';
import type { SelectListItem } from './SelectModal';
import { SelectModal } from './SelectModal';
import config from 'configs/app';

// Get l2ChainId from .env
const l2ChainId = Number(config.verse.bridge.l2ChainId) as ChainId;
const verseVersion = Number(config.verse.bridge.verseVersion) || getVerseVersion(l2ChainId);

// Validation Only numbers with a decimal point
const validateInput = (inputValue: string): boolean => {
  return /^\d*(?:\.\d*)?$/.test(inputValue);
};

const BridgePage = () => {
  const [ tokenIndex, setTokenIndex ] = useState(TokenIndex.OAS);
  const [ isDeposit, setIsDeposit ] = useState(true);
  const [ value, setValue ] = useState('');

  const tokenInfoItems: Array<SelectListItem> = useMemo(
    () =>
    // exclude TokenIndex.USDCeLegacy when deposit
      getTokenList(ChainId.OASYS, l2ChainId, isDeposit ? [ TokenIndex.USDCeLegacy ] : [])
        .map((t) => getTokenInfo(t))
        .map((t) => ({ id: t.ind, image: t.icon || '', text: t.symbol })),
    [ isDeposit ],
  );

  const handleSwap = () => {
    setIsDeposit((val) => !val);
  };

  // switch chain when switch between deposit/withdraw
  const { switchChainAsync } = useSwitchChain();
  useEffect(() => {
    const chainId = isDeposit ? ChainId.OASYS : l2ChainId
    switchChainAsync({ chainId })
  }, [isDeposit])

  const [ deposit, withdraw, loading, hash, error ] = useDepositWithdraw(verseVersion ? 1 : 0, isDeposit ? ChainId.OASYS : l2ChainId);

  const doBridge = useCallback(() => {
    if (isDeposit) {
      deposit(ChainId.OASYS, l2ChainId, tokenIndex, value);
    } else {
      withdraw(ChainId.OASYS, l2ChainId, tokenIndex, value);
    }
  }, [ deposit, withdraw, isDeposit, tokenIndex, value ]);

  const l1Balance = useBalances(ChainId.OASYS, tokenIndex);
  const l2Balance = useBalances(l2ChainId, tokenIndex);

  const setMax = useCallback(() => {
    const val = isDeposit ? l1Balance : l2Balance;
    setValue(val);
  }, [ isDeposit, l1Balance, l2Balance ]);

  const tokenDecimal = useMemo(() => getTokenInfo(tokenIndex).decimal || 18, [ tokenIndex ]);

  // Validation acceptable values in bridge input
  const validateNumber = useCallback((inputValue: string, tokenDecimal: number): boolean => {
    if (!validateInput(inputValue)) {
      return false;
    }

    const number = parseFloat(inputValue);
    if (isNaN(number) || number <= 0) {
      return false;
    }

    const [ integerPart, decimalPart ] = inputValue.split('.');

    // Return false if the total length of the integer and decimal parts exceeds 79 digits
    if ((integerPart?.length || 0) + (decimalPart?.length || 0) > 79) {
      return false;
    }

    // Return false if the decimal part exceeds the token's allowed decimal places
    if ((decimalPart?.length || 0) > tokenDecimal) {
      return false;
    }

    return true;
  }, []);

  // check input value
  const valid = useMemo(() => {
    return validateNumber(value, tokenDecimal);
  }, [ value, tokenDecimal, validateNumber ]);

  // l2 chain image
  const l2ChainImageUrl = getChainIcon(l2ChainId);

  // token info
  const tokenInfo = getTokenInfo(tokenIndex);

  const [ isSelectTokenOpen, setIsSelectTokenOpen ] = useState(false);

  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const formBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const arrowColor = useColorModeValue('#1A202C', '#FFFFFF');

  return (
    <Flex direction="column" justify="center" align="center">
      <Box
        p={6}
        rounded="lg"
        shadow="md"
        w="full"
        maxW="md"
        mt={12}
        mb={6}
        bg={formBg}
      >
        <Text fontSize="xl" fontWeight="semibold" mb={4} color={textColor}>Bridge Route</Text>

        <Flex
          direction={isDeposit ? 'column' : 'column-reverse'}
        >
          <Box mb={4}>
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" color={textColor}>
                <Text as="span" fontWeight="medium">{isDeposit ? 'From' : 'To'} </Text>
                <Text as="span" fontWeight="normal">Hub Layer</Text>
              </Text>
              <Text color={textColor}>
                {l1Balance} {tokenInfo.symbol}
              </Text>
            </Flex>
            <Flex align="center" p={3} borderWidth="1px" borderColor={borderColor} rounded="lg" bg={cardBg}>
              <Image
                src="/images/oasys_icon.png"
                alt="Oasys Mainnet"
                width={24}
                height={24}
                className="mr-2"
              />
              <Text ml={2} fontWeight="medium" w="full" color={textColor}>
                Oasys Mainnet
              </Text>
            </Flex>
          </Box>
          <Box mb={4} textAlign="center">
            <button onClick={handleSwap} className="focus:outline-none">
              <Image
                src="/images/move.svg"
                alt="move"
                width={24}
                height={24}
                className="rotate-90"
                style={{ 
                  filter: useColorModeValue(
                    'invert(0) brightness(0)', // ライトモード: 黒
                    'invert(1) brightness(1)' // ダークモード: 白
                  )
                }}
              />
            </button>
          </Box>
          <Box mb={4}>
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" color={textColor}>
                <Text as="span" fontWeight="medium">{isDeposit ? 'To' : 'From'} </Text>
                <Text as="span" fontWeight="normal">Verse</Text>
              </Text>
              <Text color={textColor}>
                {l2Balance} {tokenInfo.symbol}
              </Text>
            </Flex>
            <Flex align="center" p={3} borderWidth="1px" borderColor={borderColor} rounded="lg" bg={cardBg}>
              <Image
                src={l2ChainImageUrl}
                alt="Verse image"
                width={24}
                height={24}
                className="mr-2"
              />
              <Text ml={2} fontWeight="medium" w="full" color={textColor}>
                {CHAINS[l2ChainId].name}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Box mb={4}>
          <Text fontSize="md" fontWeight="medium" mb={2} color={textColor}>Asset</Text>
          <Flex align="center" p={3} borderWidth="1px" borderColor={borderColor} rounded="lg" bg={cardBg}>
            <Text fontSize="md" fontWeight="medium" color={textColor}>Send Token (ERC-20)</Text>
          </Flex>
          <Box mt={4}>
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontSize="sm" color={textColor}>
                <Text as="span" fontWeight="medium">Token</Text>
              </Text>
              <Text color={textColor}>
                {tokenInfo.symbol}
              </Text>
            </Flex>
            <Box
              as="button"
              onClick={() => setIsSelectTokenOpen(true)}
              w="full"
              cursor="pointer"
            >
              <Flex 
                align="center" 
                p={3} 
                borderWidth="1px" 
                borderColor={borderColor} 
                rounded="lg" 
                bg={cardBg}
                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
              >
                <Image
                  src={tokenInfo.icon || ''}
                  alt={tokenInfo.symbol}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <Text ml={2} fontWeight="medium" flex="1" textAlign="left" color={textColor}>
                  {tokenInfo.symbol}
                </Text>
                <FaAngleDown style={{ color: arrowColor }}/>
              </Flex>
            </Box>
            <Box mt={2} position="relative">
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontSize="sm" color={textColor}>
                  <Text as="span" fontWeight="medium">Amount</Text>
                </Text>
              </Flex>
              <Flex 
                align="center" 
                p={3} 
                borderWidth="1px" 
                borderColor={borderColor} 
                rounded="lg" 
                bg={useColorModeValue('white', 'gray.800')}
                position="relative"
              >
                <input
                  value={value}
                  type="text"
                  placeholder="0.0"
                  className="w-full pr-16 font-medium focus:outline-none"
                  style={{ backgroundColor: 'transparent', color: textColor }}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Box
                  as="button"
                  position="absolute"
                  right={3}
                  px={3}
                  py={1}
                  bg={useColorModeValue('gray.100', 'gray.700')}
                  color={textColor}
                  borderWidth="1px"
                  borderColor={borderColor}
                  rounded="lg"
                  _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                  onClick={setMax}
                >
                  max
                </Box>
              </Flex>
            </Box>
          </Box>
          {isSelectTokenOpen && (
            <SelectModal
              headerText="Select Token"
              items={tokenInfoItems}
              onClose={() => setIsSelectTokenOpen(false)}
              onSelect={(id) => setTokenIndex(id)}
            />
          )}
        </Box>
        <button
          className="w-full bg-sky-700 text-white font-medium rounded-lg py-2 disabled:opacity-50"
          onClick={doBridge}
          disabled={loading || !valid}
        >
          {loading ? <LoadingIcon/> : ''} Bridge
        </button>
      </Box>

      <LoadingModal loading={loading} error={error} hash={hash}/>
    </Flex>
  );
};

export default BridgePage;
