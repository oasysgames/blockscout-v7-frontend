import { Resolution } from '@blockscout/stats-types';
import type { LineCharts } from '@blockscout/stats-types';

const INFO_DATA: LineCharts = {
  sections: [
    {
      id: 'tcgverse',
      title: 'TCG verse',
      charts: [
        {
          id: 'tcgverse-amount',
          title: 'Total Amount',
          description: 'Total accumulated bridging amount',
          resolutions: [ Resolution.DAY ],
          units: 'OAS',
        },
      ],
    },
    {
      id: 'saakuru',
      title: 'Saakuru verse',
      charts: [
        {
          id: 'saakuru-amount',
          title: 'Total Amount',
          description: 'Total accumulated bridging amount',
          resolutions: [ Resolution.DAY ],
          units: 'OAS',
        },
        {
          id: 'saakuru-deposit',
          title: 'Deposit',
          description: 'Daily deposit amount',
          resolutions: [ Resolution.DAY ],
          units: 'OAS',
        },
        {
          id: 'saakuru-withdraw',
          title: 'Withdraw',
          description: 'Daily withdraw amount',
          resolutions: [ Resolution.DAY ],
          units: 'OAS',
        },
      ],
    },
  ],
};

export async function getChartsInfo(): Promise<LineCharts> {
  return Promise.resolve(INFO_DATA);
}
