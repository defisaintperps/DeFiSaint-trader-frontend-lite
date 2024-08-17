import { TraderInterface } from '@d8x/perpetuals-sdk';
import classNames from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, useMediaQuery, useTheme } from '@mui/material';

import ViewChartIcon from 'assets/icons/viewChart.svg?react';

import type { StatDataI } from 'components/stats-line/types';
import { StatsLine } from 'components/stats-line/StatsLine';
import { TooltipMobile } from 'components/tooltip-mobile/TooltipMobile';
import { calculateProbability } from 'helpers/calculateProbability';
import { orderBlockAtom } from 'store/order-block.store';
import { perpetualStaticInfoAtom, perpetualStatisticsAtom, showChartForMobileAtom } from 'store/pools.store';
import { OrderBlockE } from 'types/enums';
import { abbreviateNumber } from 'utils/abbreviateNumber';
import { formatToCurrency } from 'utils/formatToCurrency';

import styles from './PerpetualStats.module.scss';

export const PerpetualStats = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isUpToMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const orderBlock = useAtomValue(orderBlockAtom);
  const perpetualStatistics = useAtomValue(perpetualStatisticsAtom);
  const perpetualStaticInfo = useAtomValue(perpetualStaticInfoAtom);

  const [showChartForMobile, setShowChartForMobile] = useAtom(showChartForMobileAtom);

  const [[displayIndexPrice, displayMarkPrice], displayCcy] = useMemo(() => {
    if (!!perpetualStatistics && !!perpetualStaticInfo) {
      let isPredictionMarket = false;
      try {
        isPredictionMarket = TraderInterface.isPredictionMarket(perpetualStaticInfo);
      } catch {
        // skip
      }
      const px = [perpetualStatistics.indexPrice, perpetualStatistics.markPrice];
      return isPredictionMarket
        ? [px.map((x) => calculateProbability(x, orderBlock === OrderBlockE.Short)), perpetualStatistics.quoteCurrency]
        : [px, perpetualStatistics.quoteCurrency];
    }
    return [[undefined, undefined], undefined];
  }, [perpetualStatistics, perpetualStaticInfo, orderBlock]);

  const items: StatDataI[] = useMemo(
    () => [
      {
        id: 'markPrice',
        label: t('pages.trade.stats.mark-price'),
        tooltip: t('pages.trade.stats.mark-price-tooltip'),
        value: displayCcy ? formatToCurrency(displayMarkPrice, displayCcy, true) : '--',
        numberOnly: perpetualStatistics ? formatToCurrency(displayMarkPrice, '', true, undefined, true) : '--',
        // currencyOnly: perpetualStatistics ? perpetualStatistics.quoteCurrency : '--',
      },
      {
        id: 'indexPrice',
        label: t('pages.trade.stats.index-price'),
        tooltip: t('pages.trade.stats.index-price-tooltip'),
        value: displayCcy ? formatToCurrency(displayIndexPrice, displayCcy, true) : '--',
        numberOnly: displayCcy ? formatToCurrency(displayIndexPrice, '', true, undefined, true) : '--',
        // currencyOnly: perpetualStatistics ? perpetualStatistics.quoteCurrency : '--',
      },
      {
        id: 'fundingRate',
        label: t('pages.trade.stats.funding-rate'),
        tooltip: t('pages.trade.stats.funding-rate-tooltip'),
        value: perpetualStatistics ? `${(perpetualStatistics.currentFundingRateBps / 100).toFixed(3)} %` : '--',
        numberOnly: perpetualStatistics ? (perpetualStatistics.currentFundingRateBps / 100).toFixed(3) : '--',
        currencyOnly: perpetualStatistics ? '%' : '',
      },
      {
        id: 'openInterestBC',
        label: t('pages.trade.stats.open-interest'),
        tooltip: t('pages.trade.stats.open-interest-tooltip'),
        value: perpetualStatistics
          ? abbreviateNumber(perpetualStatistics.openInterestBC) + perpetualStatistics.baseCurrency
          : '--',
        numberOnly: perpetualStatistics ? abbreviateNumber(perpetualStatistics.openInterestBC) : '--',
        currencyOnly: perpetualStatistics ? perpetualStatistics.baseCurrency : '',
      },
    ],
    [t, perpetualStatistics, displayIndexPrice, displayMarkPrice, displayCcy]
  );

  if (isUpToMobileScreen) {
    return (
      <div className={styles.statContainer}>
        <div className={styles.mainMobileLine}>
          <div></div>
          <div>
            <div className={styles.viewChart} onClick={() => setShowChartForMobile(!showChartForMobile)}>
              <ViewChartIcon className={styles.viewChartIcon} />
              <Typography variant="bodyTiny">
                {t(showChartForMobile ? 'pages.trade.stats.hide-graph' : 'pages.trade.stats.view-graph')}
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.statsBlock}>
          {items.map((item) => (
            <div key={item.id}>
              {item.tooltip ? (
                <TooltipMobile tooltip={item.tooltip}>
                  <div className={classNames(styles.statLabel, styles.tooltip)}>{item.label}</div>
                </TooltipMobile>
              ) : (
                <div className={styles.statLabel}>{item.label}</div>
              )}
              <span className={styles.statValue}>{item.numberOnly}</span>{' '}
              <span className={styles.statCurrency}>{item.currencyOnly}</span>
            </div>
          ))}
        </div>
      </div>
    );

    // TODO: VOV: Make StatsLineMobile common
    // return <StatsLineMobile items={items} />;
  }

  return <StatsLine items={items} />;
};
