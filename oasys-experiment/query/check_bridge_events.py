#!/usr/bin/env python3
import json
import subprocess
from datetime import datetime
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import argparse

def format_date(day_id):
    """エポック日からYYYY-MM-DD形式に変換"""
    timestamp = int(day_id) * 86400
    return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')

def fetch_data(query):
    cmd = f'''
    curl -X POST -H "Content-Type: application/json" \
      -d '{{"query": "{query}"}}' \
      http://localhost:8000/subgraphs/name/oasys/bridge
    '''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return json.loads(result.stdout)

def check_events():
    query = """
    {
      bridgeEvents(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        eventType
        from
        to
        amount
        timestamp
        blockNumber
      }
    }
    """
    data = fetch_data(query)
    events = data['data']['bridgeEvents']
    
    print("\n=== 最新のブリッジイベント ===")
    for event in events:
        timestamp = datetime.fromtimestamp(int(event['timestamp']))
        amount = int(event['amount']) / 1e18  # WeiからETHに変換
        print(f"Type: {event['eventType']}")
        print(f"From: {event['from']}")
        print(f"To: {event['to']}")
        print(f"Amount: {amount} ETH")
        print(f"Time: {timestamp}")
        print(f"Block: {event['blockNumber']}")
        print("---")

def check_stats():
    # 今日の日付のIDを生成
    today = datetime.now().strftime("%Y-%m-%d")
    
    query = gql(f"""
    {{
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
    
    try:
        client = setup_client()
        result = client.execute(query)
        stats = result.get('dailyBridgeStats')
        
        print("\n=== 日次統計 ===")
        if stats:
            print(f"日付: {stats['date']}")
            print(f"Verse ID: {stats['verseId']}")
            print(f"チェーン名: {stats['chainName']}")
            print(f"イベントタイプ: {stats['eventType']}")
            print(f"総額: {float(stats['total_amount'])/1e18:.18f} ETH")
            print(f"取引数: {stats['count']}")
        else:
            print(f"{today}の統計情報はありません")
        print("---")
    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")

def setup_client():
    transport = RequestsHTTPTransport(
        url='http://localhost:8000/subgraphs/name/oasys/bridge'  # ローカルの場合
        # または
        # url='https://api.thegraph.com/subgraphs/name/oasys/bridge'  # 本番環境の場合
    )
    return Client(transport=transport, fetch_schema_from_transport=True)

def query_bridge_events(client, verse_id=None, event_type=None, limit=10):
    # フィルター条件の構築
    filters = []
    if verse_id:
        filters.append(f'verseId: "{verse_id}"')
    if event_type:
        filters.append(f'eventType: "{event_type}"')
    
    filter_string = ", ".join(filters)
    if filter_string:
        filter_string = f"where: {{ {filter_string} }}"

    query = gql(f"""
        {{
            bridgeEvents(
                first: {limit},
                orderBy: timestamp,
                orderDirection: desc,
                {filter_string}
            ) {{
                id
                verseId
                chainName
                eventType
                from
                to
                amount
                timestamp
                blockNumber
                transactionHash
            }}
        }}
    """)

    return client.execute(query)

def main():
    parser = argparse.ArgumentParser(description='ブリッジイベントの確認')
    parser.add_argument('--verse', help='Verse ID（例：TCGVerse）')  # --bridgeから--verseに変更
    parser.add_argument('--type', help='イベントタイプ（DEPOSIT or WITHDRAWAL）')
    parser.add_argument('--limit', type=int, default=10, help='取得するイベント数')
    
    args = parser.parse_args()
    
    try:
        client = setup_client()
        result = query_bridge_events(client, args.verse, args.type, args.limit)
        
        print(f"\n{'='*50}")
        print(f"ブリッジイベント一覧")
        print(f"{'='*50}")
        
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
            print(f"{'-'*50}")

    except Exception as e:
        print(f"エラーが発生しました: {str(e)}")

if __name__ == "__main__":
    main() 