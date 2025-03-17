import { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { getEnvValue } from 'configs/app/utils';
import BigNumber from 'bignumber.js';
import { EventType } from './useBridgeEvents';

// Define the GraphQL query for counting and summing with eventType only
export const BRIDGE_EVENTS_COUNT_QUERY_EVENT_TYPE_ONLY = gql`
  query GetBridgeEventCounts($eventType: String!) {
    bridgeEvents(
      where: { 
        eventType: $eventType
      }
    ) {
      amount
    }
  }
`;

// Define the GraphQL query for counting and summing with both eventType and chainName
export const BRIDGE_EVENTS_COUNT_QUERY_WITH_CHAIN = gql`
  query GetBridgeEventCounts($eventType: String!, $chainName: String!) {
    bridgeEvents(
      where: { 
        eventType: $eventType,
        chainName: $chainName
      }
    ) {
      amount
    }
  }
`;

interface BridgeEventCountsResponse {
  bridgeEvents: Array<{
    amount: string;
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

        let response: BridgeEventCountsResponse;

        // Use different queries based on whether chainName is provided
        if (chainName) {
          // If chainName is provided, use the query with chainName filter
          const requestParams = {
            eventType,
            chainName,
          };

          response = await client.request<BridgeEventCountsResponse>(
            BRIDGE_EVENTS_COUNT_QUERY_WITH_CHAIN,
            requestParams
          );
        } else {
          // If chainName is not provided, use the query without chainName filter
          const requestParams = {
            eventType,
          };

          response = await client.request<BridgeEventCountsResponse>(
            BRIDGE_EVENTS_COUNT_QUERY_EVENT_TYPE_ONLY,
            requestParams
          );
        }

        if (!response.bridgeEvents) {
          console.error('[Frontend] Response does not contain bridgeEvents:', response);
          setData(null);
          return;
        }

        // Count the number of withdrawal events
        const withdrawal_count = response.bridgeEvents.length.toString();
        
        // Sum the amount of all withdrawal events
        const withdrawal_sum = response.bridgeEvents.reduce((sum: BigNumber, event: { amount: string }) => {
          return sum.plus(new BigNumber(event.amount));
        }, new BigNumber(0)).toString(10);

        setData({
          withdrawal_count,
          withdrawal_sum,
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