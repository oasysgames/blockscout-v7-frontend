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