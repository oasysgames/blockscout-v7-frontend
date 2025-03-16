import { gql } from 'graphql-request';

export interface DailyBridgeStat {
  id: string;
  verseId: string;
  chainName: string;
  date: string;
  eventType: string;
  total_amount: string;
  accumulated_amount: string;
  count: string;
  blockTime: string;
}

export interface BridgeStatsResponse {
  dailyBridgeStats: DailyBridgeStat[];
}

export const DAILY_STATS_QUERY = gql`
  query GetDailyBridgeStats(
    $first: Int!,
    $orderBy: DailyBridgeStat_orderBy!,
    $orderDirection: OrderDirection!,
    $startDate: String!,
    $endDate: String!
  ) {
    dailyBridgeStats(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { 
        date_gte: $startDate,
        date_lte: $endDate
      }
    ) {
      id
      verseId
      chainName
      date
      eventType
      total_amount
      accumulated_amount
      count
      blockTime
    }
  }
`; 

export interface BridgeEvent {
  amount: number;
  blockNumber: string;
  chainName: string;
  eventType: string; // This should be 'WITHDRAW' based on your query
  from: string;
  timestamp: string;
  to: string;
  transactionHash: string;
  verseId: string;
}

export interface BridgeEventsResponse {
  bridgeEvents: BridgeEvent[];
}

export const BRIDGE_EVENTS_QUERY = gql`
  query GetBridgeEvents(
    $first: Int!,
    $skip: Int!,
    $eventTypeFilter: String!
  ) {
    bridgeEvents(
      first: $first,
      skip: $skip,
      orderBy: timestamp,
      orderDirection: desc
      where: { eventType: $eventTypeFilter }
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