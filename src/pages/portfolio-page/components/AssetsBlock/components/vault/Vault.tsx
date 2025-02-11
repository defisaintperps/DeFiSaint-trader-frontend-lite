import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-minimal-pie-chart';

import { AssetLine } from 'components/asset-line/AssetLine';
import { earningsListAtom } from 'pages/portfolio-page/store/fetchEarnings';
import { poolShareTokensShareAtom } from 'pages/portfolio-page/store/fetchPoolShare';
import { collateralToSettleConversionAtom, flatTokenAtom } from 'store/pools.store';
import { valueToFractionDigits } from 'utils/formatToCurrency';

import styles from './Vault.module.scss';

const colorsArray = ['#6649DF', '#FDA13A', '#F24141', '#515151'];

export const Vault = () => {
  const { t } = useTranslation();

  const c2s = useAtomValue(collateralToSettleConversionAtom);
  const flatToken = useAtomValue(flatTokenAtom);
  const poolShareTokensShare = useAtomValue(poolShareTokensShareAtom);
  const earningsList = useAtomValue(earningsListAtom);
  const totalPoolShare = useMemo(
    () => poolShareTokensShare.reduce((acc, curr) => acc + curr.balance, 0),
    [poolShareTokensShare]
  );

  return (
    <>
      <div className={styles.pnlBlock}>
        <div className={styles.pnlHeader}>{t('pages.portfolio.account-value.details.vault.assets-pool')}</div>
        <div className={styles.chartBlock}>
          {!!totalPoolShare && (
            <PieChart
              className={styles.pie}
              data={poolShareTokensShare.map((share, index) => ({
                title: share.balance,
                value: share.percent * 100,
                color: colorsArray[index % colorsArray.length],
              }))}
              startAngle={-90}
              paddingAngle={1}
              lineWidth={25}
            />
          )}
          <div className={styles.assetsList}>
            {poolShareTokensShare.map((share) => {
              const userSymbol =
                !!flatToken && share.poolId === flatToken.poolId && !!flatToken.registeredSymbol
                  ? flatToken.registeredSymbol
                  : share.settleSymbol;
              return (
                <AssetLine key={share.symbol} symbol={userSymbol} value={`${(share.percent * 100).toFixed(2)}%`} />
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.pnlBlock}>
        <div className={styles.pnlHeader}>{t('pages.portfolio.account-value.details.vault.earnings-pool')}</div>
        <div className={styles.assetsList}>
          {earningsList.map((earning) => {
            const [userPrice, userSymbol] =
              !!flatToken && earning.poolId === flatToken.poolId && !!flatToken.registeredSymbol
                ? [flatToken.compositePrice ?? 1, flatToken.registeredSymbol]
                : [1, earning.settleSymbol];
            return (
              <AssetLine
                key={earning.symbol}
                symbol={userSymbol}
                value={(earning.value * (c2s.get(earning.symbol)?.value ?? 1) * userPrice).toFixed(
                  Math.min(valueToFractionDigits(earning.value * (c2s.get(earning.symbol)?.value ?? 1)), 4)
                )}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
