import { useAtomValue } from 'jotai';
import { CandlestickSeries, Chart } from 'lightweight-charts-react-wrapper';
import { type CandlestickData, CrosshairMode, ISeriesApi } from 'lightweight-charts';
import { memo, Ref, useMemo } from 'react';

import { useTheme } from '@mui/material';

import { appDimensionsAtom, enabledDarkModeAtom } from 'store/app.store';

import { ONE_MINUTE_TIME, TIMEZONE_OFFSET } from '../../constants';

interface CandlesSeriesPropsI {
  width?: number;
  height?: number;
  candles: CandlestickData[];
  seriesRef: Ref<ISeriesApi<'Candlestick'>> | undefined;
  numberDigits: number;
}

const MIN_CHART_HEIGHT = 300;

function timeFormatter(timestamp: number) {
  return new Date(timestamp * 1000 - TIMEZONE_OFFSET * ONE_MINUTE_TIME).toLocaleString();
}

export const ChartBlock = memo(({ width, height, candles, seriesRef, numberDigits }: CandlesSeriesPropsI) => {
  const dimensions = useAtomValue(appDimensionsAtom);
  // A hack to make it rerender and update chart's layout
  useAtomValue(enabledDarkModeAtom);

  const theme = useTheme();

  const chartHeight = useMemo(() => {
    if (height) {
      return height;
    }
    if (dimensions.width && dimensions.width >= theme.breakpoints.values.lg) {
      return dimensions.height ? Math.max(Math.round(2 * (dimensions.height / 5)), MIN_CHART_HEIGHT) : MIN_CHART_HEIGHT;
    }
    return Math.round(Math.min(Math.max((width || MIN_CHART_HEIGHT) * 0.5, 300), MIN_CHART_HEIGHT));
  }, [dimensions, width, height, theme.breakpoints]);

  return (
    <Chart
      width={width}
      height={chartHeight}
      localization={{
        timeFormatter,
      }}
      layout={{
        background: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--d8x-color-background-items'),
        },
        textColor: getComputedStyle(document.documentElement).getPropertyValue('--d8x-color-text-main'),
      }}
      crosshair={{ mode: CrosshairMode.Normal }}
      timeScale={{
        timeVisible: true,
        barSpacing: candles.length < 60 ? 22 : 8,
      }}
    >
      <CandlestickSeries
        key={candles.length}
        data={candles}
        reactive={true}
        ref={seriesRef}
        priceFormat={{ type: 'price', precision: numberDigits, minMove: 1 / Math.pow(10, numberDigits) }}
      />
    </Chart>
  );
});
