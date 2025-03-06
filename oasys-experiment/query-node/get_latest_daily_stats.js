// index.js

// 1) graphql-request から GraphQLClient, gql をインポート
const { GraphQLClient, gql } = require('graphql-request');

// 2) サブグラフのエンドポイントを指定
const endpoint = 'http://localhost:8000/subgraphs/name/oasys/bridge';
const client = new GraphQLClient(endpoint);

// 3) 単一ID用のクエリ (Python版でいう detail_query 相当)
const detailQuery = gql`
  query GetDailyStats($id: ID!) {
    dailyBridgeStats(id: $id) {
      id
      chainName
      date
      eventType
      total_amount
      accumulated_amount
      count
    }
  }
`;

// 4) 単一ID取得関数 (Python版の get_stats_for_one_id() 相当)
async function getStatsForOneId(statsId) {
  try {
    const variables = { id: statsId };
    const data = await client.request(detailQuery, variables);
    return data?.dailyBridgeStats ?? null;
  } catch (err) {
    console.error('GraphQL request failed:', err);
    return null;
  }
}

// 5) Wei単位をETHへ変換 (Python版 format_amount 相当)
function formatAmount(weiString) {
  const weiNum = Number(weiString);
  if (Number.isNaN(weiNum)) return 0;
  return weiNum / 1e18;
}

// 6) メイン処理
async function main() {
  const dateStr = "2025-01-24";
  const addr    = "0x0cc5366be800cf73dab2dbfde031c255a6f1e3cc";
  const evt     = "DEPOSIT";

  // Python版 build_daily_bridge_stats_id と同様
  const singleId = `${dateStr}-${addr}-${evt}`;

  // 単一IDからデータ取得
  const record = await getStatsForOneId(singleId);
  if (!record) {
    console.log("Not found or error");
    return;
  }

  console.log(`Chain: ${record.chainName}`);
  console.log(`Date : ${record.date}`);
  console.log(`Event: ${record.eventType}`);
  console.log(`Count: ${record.count}`);
  console.log(`Total: ${formatAmount(record.total_amount).toFixed(2)} ETH`);
  console.log(`Accum: ${formatAmount(record.accumulated_amount).toFixed(2)} ETH`);
}

// 7) 実行
main();