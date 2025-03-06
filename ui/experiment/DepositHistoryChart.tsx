import React from 'react';
import { useColorModeValue } from '@chakra-ui/react';

import ChartWidget from 'ui/shared/chart/ChartWidget';
import type { TimeChartItem } from 'ui/shared/chart/types';

interface DailyBridgeStat {
  id: string;
  chainName: string;
  date: string;
  eventType: string;
  total_amount: string;
  count: string;
}

interface DepositHistoryChartProps {
  data: DailyBridgeStat[];
  isLoading: boolean;
  error: Error | null;
}

const DepositHistoryChart: React.FC<DepositHistoryChartProps> = ({ data, isLoading, error }) => {
  console.log('DepositHistoryChart render:', { data, isLoading, error });

  const chartData: TimeChartItem[] = React.useMemo(() => {
    console.log('Calculating chartData...');
    const depositsByDate = new Map<string, number>();

    // 日付ごとの合計デポジット量を計算
    data.forEach((stat) => {
      if (stat.eventType === 'DEPOSIT') {
        const currentAmount = depositsByDate.get(stat.date) || 0;
        const newAmount = currentAmount + Number(stat.total_amount) / 1e18;
        console.log(`Date: ${stat.date}, Current: ${currentAmount}, New: ${newAmount}`);
        depositsByDate.set(stat.date, newAmount);
      }
    });

    console.log('Deposits by date:', Object.fromEntries(depositsByDate));

    // TimeChartItem配列に変換
    const result = Array.from(depositsByDate.entries())
      .map(([date, amount]): TimeChartItem => ({
        date: new Date(date),
        value: amount,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    console.log('Final chartData:', result);
    return result;
  }, [data]);

  console.log('Rendering ChartWidget with:', { chartData, isLoading, error });

  return (
    <ChartWidget
      title="デポジット推移"
      description="日次デポジット量の合計"
      items={chartData}
      isLoading={isLoading}
      isError={!!error}
      units="OAS"
    />
  );
};

export default DepositHistoryChart; 