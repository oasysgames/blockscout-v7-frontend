import { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { getEnvValue } from 'configs/app/utils';

// Define the GraphQL query for events with eventType only
export const BRIDGE_EVENTS_QUERY_EVENT_TYPE_ONLY = gql`
  query MyQuery($first: Int!, $skip: Int!, $eventType: String!) {
    bridgeEvents(
      orderBy: timestamp, 
      orderDirection: desc, 
      first: $first, 
      skip: $skip,
      where: { 
        eventType: $eventType
      }
    ) {
      amount
      blockNumber
      chainName
      eventType
      from
      timestamp
      to
      transactionHash
      verseId
    }
  }
`;

// Define the GraphQL query for events with both eventType and chainName
export const BRIDGE_EVENTS_QUERY_WITH_CHAIN = gql`
  query MyQuery($first: Int!, $skip: Int!, $eventType: String!, $chainName: String!) {
    bridgeEvents(
      orderBy: timestamp, 
      orderDirection: desc, 
      first: $first, 
      skip: $skip,
      where: { 
        eventType: $eventType,
        chainName: $chainName
      }
    ) {
      amount
      blockNumber
      chainName
      eventType
      from
      timestamp
      to
      transactionHash
      verseId
    }
  }
`;

// Define the GraphQL query for counting events with eventType only
export const BRIDGE_EVENTS_COUNT_QUERY_EVENT_TYPE_ONLY = gql`
  query CountBridgeEvents($eventType: String!) {
    bridgeEvents(
      first: 1000,
      where: { 
        eventType: $eventType
      }
    ) {
      id
    }
  }
`;

// Define the GraphQL query for counting events with both eventType and chainName
export const BRIDGE_EVENTS_COUNT_QUERY_WITH_CHAIN = gql`
  query CountBridgeEvents($eventType: String!, $chainName: String!) {
    bridgeEvents(
      first: 1000,
      where: { 
        eventType: $eventType,
        chainName: $chainName
      }
    ) {
      id
    }
  }
`;

// Define types
export interface BridgeEvent {
  amount: string;
  blockNumber: string;
  chainName: string;
  eventType: string;
  from: string;
  timestamp: string;
  to: string;
  transactionHash: string;
  verseId: string;
}

export interface BridgeEventsResponse {
  bridgeEvents: BridgeEvent[];
}

export interface BridgeEventsCountResponse {
  bridgeEvents: Array<{ id: string }>;
}

export type EventType = 'WITHDRAW' | 'DEPOSIT';

interface UseBridgeEventsParams {
  page?: number;
  itemsPerPage?: number;
  eventType?: EventType;
  chainName?: string | null;
}

interface UseBridgeEventsResult {
  data: BridgeEvent[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems?: number;
    totalPages?: number;
  };
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

export const useBridgeEvents = ({
  page = 1,
  itemsPerPage = 20,
  eventType = 'WITHDRAW',
  chainName = null,
}: UseBridgeEventsParams = {}): UseBridgeEventsResult => {
  const [data, setData] = useState<BridgeEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const client = createClient();

        // First, get the total count of items
        let countResponse: BridgeEventsCountResponse;
        
        if (chainName) {
          countResponse = await client.request<BridgeEventsCountResponse>(
            BRIDGE_EVENTS_COUNT_QUERY_WITH_CHAIN,
            {
              eventType,
              chainName,
            }
          );
        } else {
          countResponse = await client.request<BridgeEventsCountResponse>(
            BRIDGE_EVENTS_COUNT_QUERY_EVENT_TYPE_ONLY,
            {
              eventType,
            }
          );
        }
        
        // Calculate total items and pages
        const count = countResponse.bridgeEvents.length;
        setTotalItems(count);
        const calculatedTotalPages = Math.ceil(count / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        
        // Then, get the actual data for the current page
        let response: BridgeEventsResponse;

        // Use different queries based on whether chainName is provided
        if (chainName) {
          // If chainName is provided, use the query with chainName filter
          const requestParams = {
            first: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            eventType,
            chainName,
          };

          response = await client.request<BridgeEventsResponse>(
            BRIDGE_EVENTS_QUERY_WITH_CHAIN, 
            requestParams
          );
        } else {
          // If chainName is not provided, use the query without chainName filter
          const requestParams = {
            first: itemsPerPage,
            skip: (page - 1) * itemsPerPage,
            eventType,
          };

          response = await client.request<BridgeEventsResponse>(
            BRIDGE_EVENTS_QUERY_EVENT_TYPE_ONLY, 
            requestParams
          );
        }

        if (!response.bridgeEvents) {
          console.error('[Frontend] Response does not contain bridgeEvents:', response);
          setData([]);
          return;
        }

        // Ensure we only return exactly itemsPerPage items
        const limitedData = response.bridgeEvents.slice(0, itemsPerPage);
        setData(limitedData);
        
        // Check if there are more pages
        setHasNextPage(page < calculatedTotalPages);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching bridge events:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch bridge events'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, itemsPerPage, eventType, chainName]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    pagination: {
      currentPage: page,
      hasNextPage,
      hasPreviousPage: page > 1,
      totalItems,
      totalPages,
    },
  };
};
