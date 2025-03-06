import type { StatsIntervalIds } from 'types/client/stats';
import type { TimeChartItem } from 'ui/shared/chart/types';

import { STATS_INTERVALS } from 'ui/stats/constants';

const data: Array<TimeChartItem> = [
  {
    date: new Date('2025-01-10'),
    value: 100,
  },
  {
    date: new Date('2025-01-11'),
    value: 80,
  },
  {
    date: new Date('2025-01-12'),
    value: 120,
  },
  {
    date: new Date('2025-01-13'),
    value: 120,
  },
  {
    date: new Date('2025-01-14'),
    value: 140,
  },
  {
    date: new Date('2025-01-15'),
    value: 180,
  },
  {
    date: new Date('2025-01-16'),
    value: 110,
  },
  {
    date: new Date('2025-01-17'),
    value: 50,
  },
  {
    date: new Date('2025-01-18'),
    value: 140,
  },
  {
    date: new Date('2025-01-19'),
    value: 100,
  },
];

export function getVerseDailyAmount(id: string, interval: StatsIntervalIds): Promise<Array<TimeChartItem>> {
  const selectedInterval = STATS_INTERVALS[interval];

  // eslint-disable-next-line
  console.log(selectedInterval, id);

  return Promise.resolve(data);
}
