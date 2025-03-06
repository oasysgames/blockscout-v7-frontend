const { GraphQLClient, gql } = require('graphql-request')
const { formatEther } = require('ethers/lib/utils')

// GraphQLクライアントの設定
const endpoint = 'http://localhost:8000/subgraphs/name/oasys/bridge'
const graphQLClient = new GraphQLClient(endpoint)

// 日付範囲のデフォルト値
const getTimestamp = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return Math.floor(date.getTime() / 1000).toString()
}

const startDate = process.argv[2] || getTimestamp(2000) // デフォルト: 2000日前
const endDate = process.argv[3] || getTimestamp(0)   // デフォルト: 今日

// クエリの定義
const query = gql`
  query GetBridgeEvents($startDate: String!, $endDate: String!, $skip: Int!) {
    bridgeEvents(
      where: { timestamp_gte: $startDate, timestamp_lte: $endDate }
      orderBy: timestamp
      first: 1000
      skip: $skip
    ) {
      id
      timestamp
      chainName
      eventType
      amount
      transactionHash
      from
      to
    }
  }
`

async function fetchAllEvents(startDate, endDate) {
  let allEvents = []
  let skip = 0
  
  while (true) {
    const result = await graphQLClient.request(query, { startDate, endDate, skip })
    const events = result.bridgeEvents
    
    if (events.length === 0) break
    
    allEvents = allEvents.concat(events)
    skip += 1000
    
    console.log(`取得済みトランザクション数: ${allEvents.length}`)
  }
  
  return allEvents
}

async function main() {
  try {
    const startDateStr = new Date(parseInt(startDate) * 1000).toISOString().split('T')[0]
    const endDateStr = new Date(parseInt(endDate) * 1000).toISOString().split('T')[0]
    console.log(`期間: ${startDateStr} から ${endDateStr}`)
    
    // 全てのイベントを取得
    console.log('トランザクションデータを取得中...')
    const events = await fetchAllEvents(startDate, endDate)

    const netByChain = {}
    const transactions = []

    events.forEach((item) => {
      const chain = item.chainName
      const amountWei = item.amount || '0'
      const amountEth = parseFloat(formatEther(amountWei))
      const date = new Date(parseInt(item.timestamp) * 1000).toISOString().split('T')[0]

      // 初期化
      if (!netByChain[chain]) netByChain[chain] = 0

      if (item.eventType === 'DEPOSIT') {
        netByChain[chain] += amountEth
      } else if (item.eventType === 'WITHDRAW') {
        // console.log('WITHDRAW', amountEth)
        netByChain[chain] -= amountEth
      }

      // トランザクション情報を保存
      transactions.push({
        date,
        chain,
        type: item.eventType,
        amount: amountEth,
        hash: item.transactionHash,
        from: item.from,
        to: item.to,
        runningBalance: netByChain[chain]
      })
    })

    // 日付順にトランザクションを表示
    console.log('\nDetailed Transaction Log:')
    console.log('Date\t\tChain\t\tType\t\tAmount(ETH)\tFrom\t\tTo\t\tTx Hash\t\tRunning Balance(ETH)')
    console.log('-'.repeat(160))
    transactions.forEach((tx, index) => {
      if (index % 200 === 0) {  // 200回に1回だけ出力
        const shortHash = tx.hash.substring(0, 10) + '...'
        const shortFrom = tx.from.substring(0, 10) + '...'
        const shortTo = tx.to.substring(0, 10) + '...'
        // console.log(`${tx.date}\t${tx.chain.padEnd(15)}\t${tx.type.padEnd(8)}\t${tx.amount.toFixed(4).padStart(10)}\t${shortFrom.padEnd(15)}\t${shortTo.padEnd(15)}\t${shortHash.padEnd(15)}\t${tx.runningBalance.toFixed(4).padStart(10)}`)
      }
    })

    console.log('\nFinal Net Balance by Chain:')
    Object.entries(netByChain).forEach(([chain, balance]) => {
      console.log(`${chain}: ${balance.toFixed(4)} OAS`)
    })

    console.log(`\nTotal number of transactions: ${transactions.length}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 