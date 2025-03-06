import React, { useCallback, useMemo, useState, useEffect } from 'react';

import type { LineChartInfo, LineChartSection } from '@blockscout/stats-types';
import type { DailyBridgeStat } from './services/types';

import { useBridgeStats } from './services/useBridgeStats';

interface VerseStats {
  verseId: string;
  chainName: string;
  depositAmount: number;
  withdrawAmount: number;
  depositCount: number;
  withdrawCount: number;
  latestBlockTime: string;
}

interface AccumulatedStats {
  verseId: string;
  chainName: string;
  accumulated_amount: number;
  latestBlockTime: string;
  date: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ChainChartData {
  chainName: string;
  data: ChartDataPoint[];
}

function isSectionMatches(section: LineChartSection, currentSection: string): boolean {
  return currentSection === 'all' || section.id === currentSection;
}

function isChartNameMatches(q: string, chart: LineChartInfo) {
  return chart.title.toLowerCase().includes(q.toLowerCase());
}

// Wei単位をETHへ変換
function formatAmount(weiString: string): number {
  const weiNum = Number(weiString);
  if (Number.isNaN(weiNum)) return 0;
  return weiNum / 1e18;
}

export const useExperiment = () => {
  // 初期値を設定
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 現在の月を取得（1-12）
  
  // 今月の最終日を取得
  const lastDayOfMonth = new Date(year, month, 0);
  
  // YYYY-MM-DD形式の文字列を作成
  const firstDayStr = `${year}-${month.toString().padStart(2, '0')}-01`;
  const lastDayStr = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(lastDayStr);
  const [chainFilter, setChainFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  // コンポーネントマウント時に初期値を設定
  useEffect(() => {
    if (!startDate) setStartDate(firstDayStr);
    if (!endDate) setEndDate(lastDayStr);
  }, []);

  // Bridge stats data
  const { data, isLoading, error } = useBridgeStats({
    startDate,
    endDate,
    chainFilter,
    eventTypeFilter,
  });

  // Computed values

  const uniqueChains = useMemo(() => {
    const chains = new Set(['all', ...(data?.map(item => item.chainName) || [])]);
    return Array.from(chains);
  }, [data]);

  const uniqueEventTypes = useMemo(() => {
    const types = new Set(['all', ...(data?.map(item => item.eventType) || [])]);
    return Array.from(types);
  }, [data]);

  // Verse別の統計データを計算
  const verseStats = useMemo(() => {
    if (!data) return [];

    const verseMap = new Map<string, VerseStats>();

    data.forEach(item => {
      const key = item.verseId;
      const current = verseMap.get(key) || {
        verseId: item.verseId,
        chainName: item.chainName,
        depositAmount: 0,
        withdrawAmount: 0,
        depositCount: 0,
        withdrawCount: 0,
        latestBlockTime: item.blockTime,
      };

      if (item.eventType === 'DEPOSIT') {
        current.depositAmount += formatAmount(item.total_amount);
        current.depositCount += Number(item.count);
      } else if (item.eventType === 'WITHDRAW') {
        current.withdrawAmount += formatAmount(item.total_amount);
        current.withdrawCount += Number(item.count);
      }

      if (Number(item.blockTime) > Number(current.latestBlockTime)) {
        current.latestBlockTime = item.blockTime;
      }

      verseMap.set(key, current);
    });

    return Array.from(verseMap.values());
  }, [data]);

  const handleStartDateChange = useCallback((date: string) => {
    setStartDate(date);
  }, []);

  const handleEndDateChange = useCallback((date: string) => {
    setEndDate(date);
  }, []);

  const handleChainFilterChange = useCallback((chain: string) => {
    setChainFilter(chain);
  }, []);

  const handleEventTypeFilterChange = useCallback((type: string) => {
    setEventTypeFilter(type);
  }, []);

  // 日付ごとの最新accumulated_amountを計算
  const dailyAccumulatedStats = useMemo(() => {
    if (!data) return [];

    // 日付とチェーンでグループ化
    const groupedData = new Map<string, Map<string, DailyBridgeStat[]>>();
    
    data.forEach(item => {
      const dateKey = item.date;
      const chainKey = item.chainName;
      
      if (!groupedData.has(dateKey)) {
        groupedData.set(dateKey, new Map());
      }
      
      const chainMap = groupedData.get(dateKey)!;
      if (!chainMap.has(chainKey)) {
        chainMap.set(chainKey, []);
      }
      
      chainMap.get(chainKey)!.push(item);
    });

    // 各日付・チェーンの最新データを取得
    const result: AccumulatedStats[] = [];
    
    groupedData.forEach((chainMap, date) => {
      chainMap.forEach((stats, chainName) => {
        // blockTimeで並び替えて最新のものを取得
        const latestStat = stats.reduce((latest, current) => {
          return Number(current.blockTime) > Number(latest.blockTime) ? current : latest;
        });

        result.push({
          verseId: latestStat.verseId,
          chainName: latestStat.chainName,
          accumulated_amount: formatAmount(latestStat.accumulated_amount),
          latestBlockTime: latestStat.blockTime,
          date: latestStat.date,
        });
      });
    });

    return result;
  }, [data]);

  // チェーンごとの最新accumulated_amount合計
  const totalAccumulatedByChain = useMemo(() => {
    const latestByChain = new Map<string, AccumulatedStats>();
    
    dailyAccumulatedStats.forEach(stat => {
      const current = latestByChain.get(stat.chainName);
      if (!current || Number(stat.latestBlockTime) > Number(current.latestBlockTime)) {
        latestByChain.set(stat.chainName, stat);
      }
    });

    return Array.from(latestByChain.values());
  }, [dailyAccumulatedStats]);

  // チャート用のデータ生成
  const chainChartData = useMemo(() => {
    const chainData = new Map<string, ChartDataPoint[]>();

    dailyAccumulatedStats.forEach(stat => {
      if (!chainData.has(stat.chainName)) {
        chainData.set(stat.chainName, []);
      }

      chainData.get(stat.chainName)!.push({
        date: stat.date,
        value: stat.accumulated_amount,
      });
    });

    return Array.from(chainData.entries()).map(([chainName, data]) => ({
      chainName,
      data: data.sort((a, b) => a.date.localeCompare(b.date)),
    }));
  }, [dailyAccumulatedStats]);

  return React.useMemo(() => ({
    // GraphQLデータ関連
    data,
    isLoading,
    error,
    startDate,
    endDate,
    chainFilter,
    eventTypeFilter,
    uniqueChains,
    uniqueEventTypes,
    verseStats,
    handleStartDateChange,
    handleEndDateChange,
    handleChainFilterChange,
    handleEventTypeFilterChange,
    totalAccumulatedByChain,
    chainChartData,
  }), [
    data,
    isLoading,
    error,
    startDate,
    endDate,
    chainFilter,
    eventTypeFilter,
    uniqueChains,
    uniqueEventTypes,
    verseStats,
    handleStartDateChange,
    handleEndDateChange,
    handleChainFilterChange,
    handleEventTypeFilterChange,
    totalAccumulatedByChain,
    chainChartData,
  ]);
}
