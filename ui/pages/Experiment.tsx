import { Box, Select, Input, Grid, Text, VStack, HStack, Spinner, SimpleGrid, useColorModeValue, Image } from '@chakra-ui/react';

import ChartWidget from 'ui/shared/chart/ChartWidget';
import { useExperiment } from '../experiment/useExperiment';

const CHART_COLORS = [
  '#FF6B6B', // red
  '#4FD1C5', // teal
  '#63B3ED', // blue
  '#9F7AEA', // purple
  '#F6E05E', // yellow
  '#68D391', // green
  '#FC8181', // pink
  '#4299E1', // lightblue
  '#B794F4', // violet
  '#F6AD55', // orange
];

const getChainLogoPath = (chainName: string) => {
  const baseName = chainName.toLowerCase().replace('verse', '');
  return `/images/chains/${baseName}.png`;
};

const Experiment = () => {
  const {
    isLoading,
    error,
    startDate,
    endDate,
    chainFilter,
    uniqueChains,
    handleStartDateChange,
    handleEndDateChange,
    handleChainFilterChange,
    totalAccumulatedByChain,
    chainChartData,
  } = useExperiment();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const boxShadow = useColorModeValue('sm', 'none');

  return (
    <>
      {/* Filter Section */}
      <Box mb={6}>
        <HStack spacing={4}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
          <Select
            value={chainFilter}
            onChange={(e) => handleChainFilterChange(e.target.value)}
          >
            {uniqueChains.map(chain => (
              <option key={chain} value={chain}>{chain}</option>
            ))}
          </Select>
        </HStack>
      </Box>

      {/* Total Deposit Heading */}
      <Box mb={6}>
        <HStack spacing={4} align="baseline" wrap="wrap">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Total Deposit
          </Text>
          <Text fontSize="xl" fontWeight="semibold" color="blue.500">
            {((totalAccumulatedByChain.reduce((sum, chain) => sum + chain.accumulated_amount, 0) / 1000)).toLocaleString(undefined, { maximumFractionDigits: 2 })}k OAS
          </Text>
          <Text fontSize="md" color="gray.500">
            (Last Update: {new Date(Math.max(...totalAccumulatedByChain.map(chain => Number(chain.latestBlockTime) * 1000))).toLocaleString()})
          </Text>
        </HStack>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box textAlign="center" my={4}>
          <Spinner />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box bg="red.100" p={4} borderRadius="md" mb={4}>
          <Text color="red.600">{error.message}</Text>
        </Box>
      )}

      {/* Pie Chart and Stats Grid */}
      <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={6} mb={8}>
        {/* Pie Chart */}
        <Box
          p={5}
          bg={bgColor}
          borderRadius="lg"
          boxShadow={boxShadow}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box position="relative" width="250px" height="250px">
            <Box
              width="100%"
              height="100%"
              borderRadius="50%"
              background={`conic-gradient(${totalAccumulatedByChain
                .sort((a, b) => b.accumulated_amount - a.accumulated_amount)
                .map((chain: { accumulated_amount: number }, index: number, arr: Array<{ accumulated_amount: number }>) => {
                  const total = arr.reduce((sum, c) => sum + c.accumulated_amount, 0);
                  const startPercent = arr
                    .slice(0, index)
                    .reduce((sum, c) => sum + (c.accumulated_amount / total) * 100, 0);
                  const endPercent = startPercent + (chain.accumulated_amount / total) * 100;
                  return `${CHART_COLORS[index % CHART_COLORS.length]} ${startPercent}% ${endPercent}%`;
                })
                .join(', ')
              })`}
            />
            <VStack
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              spacing={1}
              align="center"
            >
              <Text fontSize="sm" color={textColor}>Total Deposit</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">
                {((totalAccumulatedByChain.reduce((sum, chain) => sum + chain.accumulated_amount, 0) / 1000)).toLocaleString(undefined, { maximumFractionDigits: 2 })}k OAS
              </Text>
            </VStack>
          </Box>
          {/* Legend */}
          <VStack mt={4} spacing={2} align="stretch" width="100%">
            {totalAccumulatedByChain
              .sort((a, b) => b.accumulated_amount - a.accumulated_amount)
              .map((chain, index) => {
                const total = totalAccumulatedByChain.reduce((sum, c) => sum + c.accumulated_amount, 0);
                const percentage = ((chain.accumulated_amount / total) * 100).toFixed(1);
                return (
                  <HStack key={chain.chainName} spacing={2} align="center">
                    <Box
                      w="12px"
                      h="12px"
                      borderRadius="sm"
                      bg={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                    <Box w="20px" h="20px" position="relative">
                      <Image
                        src={getChainLogoPath(chain.chainName)}
                        alt={`${chain.chainName} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    <Text fontSize="sm" color={textColor}>{chain.chainName}</Text>
                    <Text fontSize="sm" color="gray.500" ml="auto">{percentage}%</Text>
                  </HStack>
                );
              })}
          </VStack>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {totalAccumulatedByChain.map((stat) => (
            <Box
              key={stat.chainName}
              p={5}
              bg={bgColor}
              borderRadius="lg"
              boxShadow={boxShadow}
            >
              <HStack spacing={2} mb={2} align="center">
                <Box w="32px" h="32px" position="relative">
                  <Image
                    src={getChainLogoPath(stat.chainName)}
                    alt={`${stat.chainName} logo`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {stat.chainName}
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {(stat.accumulated_amount / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}k OAS
              </Text>
              <Text fontSize="sm" color="gray.500">
                Last Update: {new Date(Number(stat.latestBlockTime) * 1000).toLocaleString()}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Grid>

      {/* Accumulated Amount Chart by Chain */}
      {chainChartData.map((chain) => {
        return (
          <Box key={chain.chainName} mb={6}>
            <ChartWidget
              title={`${chain.chainName} Total Deposit History`}
              description="Daily total deposit"
              items={chain.data.map(item => ({
                date: new Date(item.date),
                value: Number(item.value),
              }))}
              isLoading={isLoading}
              isError={!!error}
              units="OAS"
              valueFormatter={(val: number) => `${(val / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })}k`}
            />
          </Box>
        );
      })}
    </>
  );
};

export default Experiment;
