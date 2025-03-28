import { chakra } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import type { StatsIntervalIds } from 'types/client/stats';

import type { Route } from 'nextjs-routes';

import ChartWidget from '../shared/chart/ChartWidget';
import { getVerseDailyAmount } from './api/getVerseDailyAmount';
import { useApiData } from './useApiData';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const ChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  units,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const params = useMemo(() => [ id, interval ] as [ string, StatsIntervalIds ], [ id, interval ]);
  const { data, isError } = useApiData(getVerseDailyAmount, params, []);

  useEffect(() => {
    if (isError) {
      onLoadingError();
    }
  }, [ isError, onLoadingError ]);

  return (
    <ChartWidget
      isError={ isError }
      items={ data }
      title={ title }
      units={ units }
      description={ description }
      isLoading={ isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href }
    />
  );
};

export default chakra(ChartWidgetContainer);
