// index.js

// 1) graphql-request から GraphQLClient, gql をインポート
const { GraphQLClient, gql } = require('graphql-request');

// 2) サブグラフのエンドポイントを指定
const endpoint = 'http://localhost:8000/subgraphs/name/oasys/bridge';
const client = new GraphQLClient(endpoint);

// 3) 単一ID用のクエリ (Python版でいう detail_query 相当)
const detailQuery = gql`
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
`;

// リスト取得用のクエリを修正
const listQuery = gql`
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

// 4) 単一ID取得関数 (Python版の get_stats_for_one_id() 相当)
async function getStatsForOneId(statsId) {
  try {
    const variables = { id: statsId };
    // console.log("単一ID変数:", JSON.stringify(variables, null, 2));
    const data = await client.request(detailQuery, variables);
    // console.log("単一IDレスポンス:", JSON.stringify(data, null, 2));
    return data?.dailyBridgeStats ?? null;
  } catch (err) {
    console.error('GraphQL request failed:', err.message);
    if (err.response) {
      console.error('GraphQL エラー詳細:', JSON.stringify(err.response.errors, null, 2));
    }
    return null;
  }
}

// リスト取得関数を修正してデバッグ情報を追加
async function getDailyStatsList() {
  try {
    const variables = {
      first: 1000,
      orderBy: "date",
      orderDirection: "desc",
      startDate: "2025-01-20",
      endDate: "2025-01-20"
    };
    
    // console.log("クエリ変数:", JSON.stringify(variables, null, 2));
    const data = await client.request(listQuery, variables);
    // console.log("レスポンス:", JSON.stringify(data, null, 2));
    
    return data?.dailyBridgeStats ?? [];
  } catch (err) {
    console.error('GraphQL request failed:', err.message);
    if (err.response) {
      console.error('GraphQL エラー詳細:', JSON.stringify(err.response.errors, null, 2));
    }
    return [];
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
  // 単一ID取得のテスト
  const dateStr = "2025-01-01";
  const addr    = "0xa16517a9796bac73efa7d07269f9818b7978dc2a";
  const evt     = "DEPOSIT";

  // Python版 build_daily_bridge_stats_id と同様
  const singleId = `${dateStr}-${addr}-${evt}`;

  console.log("=== 単一IDで取得 ===");
  console.log(`ID = ${singleId}`);

  // 単一IDからデータ取得
  const record = await getStatsForOneId(singleId);
  if (!record) {
    console.log("Not found or error");
  } else {
    console.log(`Chain: ${record.chainName}`);
    console.log(`Date : ${record.date}`);
    console.log(`Event: ${record.eventType}`);
    console.log(`Count: ${record.count}`);
    console.log(`Total: ${formatAmount(record.total_amount).toFixed(2)} OAS`);
    console.log(`Accum: ${formatAmount(record.accumulated_amount).toFixed(2)} OAS`);
    console.log(`Block Time: ${new Date(Number(record.blockTime) * 1000).toISOString()}`);
  }

  // リスト取得のテスト
  console.log("\n=== リストで取得 ===");
  const records = await getDailyStatsList();

  if (records.length === 0) {
    console.log("No records found");
  } else {
    records.forEach(record => {
      console.log(`\nChain: ${record.chainName}`);
      console.log(`Date : ${record.date}`);
      console.log(`Event: ${record.eventType}`);
      console.log(`Count: ${record.count}`);
      console.log(`Total: ${formatAmount(record.total_amount).toFixed(2)} OAS`);
      console.log(`Accum: ${formatAmount(record.accumulated_amount).toFixed(2)} OAS`);
      console.log(`Block Time: ${new Date(Number(record.blockTime) * 1000).toISOString()}`);
    });
  }
}

// 7) 実行
main();