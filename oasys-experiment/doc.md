# Oasys Bridge Subgraph Query Implementation

## Overview
This implementation provides GraphQL queries to fetch bridge statistics from the Oasys Bridge Subgraph.

## Prerequisites
- Node.js version: 20.17.0
- @graphprotocol/graph-cli version: 0.93.0

## Features
- Fetch daily bridge statistics by ID
- Fetch a list of daily bridge statistics within a date range
- Format Wei amounts to ETH
- Error handling for GraphQL requests

## Query Examples

### Daily Bridge Stats Query
```graphql
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
```

### Single ID Query
```graphql
query GetDailyStats($id: ID!) {
  dailyBridgeStat(id: $id) {
    id
    chainName
    date
    eventType
    total_amount
    accumulated_amount
    count
    blockTime
  }
}
```

## Implementation Details
- Uses `graphql-request` library for GraphQL client implementation
- Includes error handling and debugging capabilities
- Provides Wei to ETH conversion utility
- Supports both single record and list queries

## Usage Example
```javascript
// Initialize client
const endpoint = 'http://localhost:8000/subgraphs/name/oasys/bridge';
const client = new GraphQLClient(endpoint);

// Fetch list of stats
const variables = {
  first: 1000,
  orderBy: "date",
  orderDirection: "desc",
  startDate: "2022-12-20",
  endDate: "2022-12-26"
};

// Execute query
const data = await client.request(listQuery, variables);
```

## Error Handling
The implementation includes comprehensive error handling:
- GraphQL request failures
- Response validation
- Data format validation
- Wei to ETH conversion safety checks 