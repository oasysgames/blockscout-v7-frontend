#!/usr/bin/env python3
import json
import subprocess
import sys
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from datetime import datetime

# GraphQL エンドポイントの設定
transport = RequestsHTTPTransport(
    url='http://localhost:8000/subgraphs/name/oasys/bridge'  # ローカルの場合
    # または
    # url='https://api.thegraph.com/subgraphs/name/oasys/bridge'  # 本番環境の場合
)

client = Client(transport=transport, fetch_schema_from_transport=True)

# 今日の日付のIDを生成
today = datetime.now().strftime("%Y-%m-%d")

# クエリの定義
query = gql(f"""
    {{
        bridgeEvents(first: 5, orderBy: timestamp, orderDirection: desc) {{
            id
            eventType
            from
            to
            amount
            timestamp
            verseId
            chainName
            blockNumber
            transactionHash
        }}
        
        # 統計情報の取得（今日の日付を指定）
        dailyBridgeStats(id: "{today}") {{
            id
            date
            verseId
            chainName
            eventType
            total_amount
            count
        }}
    }}
""")

def main():
    try:
        # クエリの実行
        result = client.execute(query)
        
        # 結果の表示
        print("最新のブリッジイベント:")
        for event in result['bridgeEvents']:
            print(f"\nイベントID: {event['id']}")
            print(f"Verse ID: {event['verseId']}")
            print(f"チェーン名: {event['chainName']}")
            print(f"タイプ: {event['eventType']}")
            print(f"送信元: {event['from']}")
            print(f"送信先: {event['to']}")
            print(f"金額: {float(event['amount'])/1e18:.18f} ETH")
            print(f"タイムスタンプ: {event['timestamp']}")
            print(f"ブロック番号: {event['blockNumber']}")
            print(f"トランザクションハッシュ: {event['transactionHash']}")
        
        # 統計情報の表示
        stats = result.get('dailyBridgeStats')
        if stats:
            print(f"\n日次統計情報 ({stats['date']}):")
            print(f"デポジット総数: {stats['count']}")
            print(f"デポジット総額: {float(stats['total_amount'])/1e18:.18f} ETH")
        else:
            print(f"\n本日（{today}）の統計情報はありません")

    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 