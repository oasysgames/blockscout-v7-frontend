import type { FastifyPluginAsync } from 'fastify';
import { gql } from 'graphql-request';

import { client } from '../graphql';

const bridgeDepositsRoutes: FastifyPluginAsync = async(fastify) => {
  // チェーンごとの総deposit取得
  fastify.get('/total-deposits', async() => {
    const query = gql`
      query GetTotalDeposits {
        chains {
          id
          name
          totalDeposits
        }
      }
    `;

    const data = await client.request(query);
    return data;
  });

  // チェーンごとのdeposit推移取得
  fastify.get('/deposit-history', async(request) => {
    const { interval = '30' } = request.query as { interval?: string };

    const query = gql`
      query GetDepositHistory($days: Int!) {
        depositStats(first: $days, orderBy: timestamp, orderDirection: desc) {
          id
          chainId
          timestamp
          dailyDeposits
        }
      }
    `;

    const data = await client.request(query, { days: parseInt(interval) });
    return data;
  });
};

export default bridgeDepositsRoutes;
