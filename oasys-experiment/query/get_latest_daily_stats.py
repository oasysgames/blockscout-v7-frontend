#!/usr/bin/env python3

from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from datetime import datetime

# GraphQLクライアントの設定
transport = RequestsHTTPTransport(
    url='http://localhost:8000/subgraphs/name/oasys/bridge',
    verify=True,
    retries=3,
)
client = Client(transport=transport, fetch_schema_from_transport=True)

########################
# 単一IDを取得する例
########################

def build_daily_bridge_stats_id(date_str: str, bridge_address: str, event_type: str) -> str:
    """
    例:
      date_str       = "2025-01-24"
      bridge_address = "0x0cc5366be800cf73dab2dbfde031c255a6f1e3cc"
      event_type     = "DEPOSIT"

    → "2025-01-24-0x0cc5366be800cf73dab2dbfde031c255a6f1e3cc-DEPOSIT"
    """
    return f"{date_str}-{bridge_address}-{event_type}"

# 単一レコードを取得する Query
detail_query = gql("""
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
""")

def get_stats_for_one_id(stats_id: str):
    """
    単一IDに対応する dailyBridgeStats を取得する
    """
    result = client.execute(detail_query, variable_values={'id': stats_id})
    return result.get("dailyBridgeStats", None)

def format_amount(amount_str):
    """
    Wei単位の文字列をETH単位の浮動小数点数に変換
    """
    return float(amount_str) / 1e18

def main():
    """
    (A) 単一IDの取得のみ実行
    """
    print("=== 単一IDで取得 ===")
    date_str = "2025-01-24"
    addr = "0x0cc5366be800cf73dab2dbfde031c255a6f1e3cc"
    # evt = "DEPOSIT"
    evt = "WITHDRAW"
    single_id = build_daily_bridge_stats_id(date_str, addr, evt)
    record = get_stats_for_one_id(single_id)
    print(f"ID = {single_id}")
    if record:
        print(f"Chain: {record['chainName']}")
        print(f"Date : {record['date']}")
        print(f"Event: {record['eventType']}")
        print(f"Count: {record['count']}")
        print(f"Total: {format_amount(record['total_amount']):.2f} ETH")
        print(f"Accum: {format_amount(record['accumulated_amount']):.2f} ETH")
    else:
        print("Not found or error")

    # (B) 一覧を取得して日付でフィルタする処理は、スキーマ上存在しないためコメントアウト
    # print("\n=== 一覧からフィルタ ===")
    # today = datetime.now().strftime('%Y-%m-%d')
    # stats = get_latest_daily_stats(today)
    # ... 以下略 ...

if __name__ == "__main__":
    main()