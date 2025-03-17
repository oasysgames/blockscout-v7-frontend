import { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { getEnvValue } from 'configs/app/utils';
import BigNumber from 'bignumber.js';
import { EventType } from './useBridgeEvents';

// Define the GraphQL query for getting events with pagination (eventType only)
export const BRIDGE_EVENTS_QUERY_EVENT_TYPE_ONLY = gql`
  query GetBridgeEvents($eventType: String!, $first: Int!, $skip: Int!) {
    bridgeEvents(
      first: $first,
      skip: $skip,
      where: { 
        eventType: $eventType
      }
    ) {
      amount
      id
    }
  }
`;

// Define the GraphQL query for getting events with pagination (with chainName)
export const BRIDGE_EVENTS_QUERY_WITH_CHAIN = gql`
  query GetBridgeEvents($eventType: String!, $chainName: String!, $first: Int!, $skip: Int!) {
    bridgeEvents(
      first: $first,
      skip: $skip,
      where: { 
        eventType: $eventType,
        chainName: $chainName
      }
    ) {
      amount
      id
    }
  }
`;

interface BridgeEventResponse {
  bridgeEvents: Array<{
    amount: string;
    id: string;
  }>;
}

interface UseBridgeEventCountsParams {
  eventType?: EventType;
  chainName?: string | null;
}

interface UseBridgeEventCountsResult {
  data: {
    withdrawal_count: string;
    withdrawal_sum: string;
  } | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isPlaceholderData: boolean;
}

const createClient = () => {
  const url = getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL');
  
  if (!url) {
    throw new Error('NEXT_PUBLIC_EXPERIMENT_API_URL is not defined');
  }
  
  return new GraphQLClient(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useBridgeEventCounts = ({
  eventType = 'WITHDRAW',
  chainName = null,
}: UseBridgeEventCountsParams = {}): UseBridgeEventCountsResult => {
  const [data, setData] = useState<{
    withdrawal_count: string;
    withdrawal_sum: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPlaceholderData, setIsPlaceholderData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const client = createClient();

        // Fetch all data in batches to calculate the total count and sum
        let totalCount = 0;
        let totalSum = new BigNumber(0);
        const batchSize = 1000; // Maximum items per request
        let hasMoreData = true;
        let currentSkip = 0;
        
        while (hasMoreData) {
          let response: BridgeEventResponse;
          
          if (chainName) {
            response = await client.request<BridgeEventResponse>(
              BRIDGE_EVENTS_QUERY_WITH_CHAIN,
              { 
                eventType, 
                chainName, 
                first: batchSize, 
                skip: currentSkip 
              }
            );
          } else {
            response = await client.request<BridgeEventResponse>(
              BRIDGE_EVENTS_QUERY_EVENT_TYPE_ONLY,
              { 
                eventType, 
                first: batchSize, 
                skip: currentSkip 
              }
            );
          }
          
          if (!response.bridgeEvents || response.bridgeEvents.length === 0) {
            hasMoreData = false;
            break;
          }
          
          // Increment the total count
          totalCount += response.bridgeEvents.length;
          
          // Sum the amounts in this batch
          response.bridgeEvents.forEach(event => {
            totalSum = totalSum.plus(new BigNumber(event.amount));
          });
          
          // Check if we need to fetch more data
          if (response.bridgeEvents.length < batchSize) {
            hasMoreData = false;
          } else {
            currentSkip += batchSize;
          }
        }

        setData({
          withdrawal_count: totalCount.toString(),
          withdrawal_sum: totalSum.toString(10),
        });
        
        setIsPlaceholderData(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching bridge event counts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch bridge event counts'));
        // Keep placeholder data in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventType, chainName]);

  return {
    data: data || {
      withdrawal_count: '0',
      withdrawal_sum: '0',
    },
    isLoading,
    isError: !!error,
    error,
    isPlaceholderData,
  };
}; 