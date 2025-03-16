import { useAtom, useAtomValue } from 'jotai';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import { Box, Typography } from '@mui/material';

import { InfoLabelBlock } from 'components/info-label-block/InfoLabelBlock';
import { getEarnings } from 'network/history';
import { collateralToSettleConversionAtom, flatTokenAtom, selectedPoolAtom, traderAPIAtom } from 'store/pools.store';
import {
  sdkConnectedAtom,
  triggerUserStatsUpdateAtom,
  userAmountAtom,
  withdrawalOnChainAtom,
  withdrawalsAtom,
} from 'store/vault-pools.store';
import { isEnabledChain } from 'utils/isEnabledChain';
import { formatToCurrency, valueToFractionDigits } from 'utils/formatToCurrency';

import styles from './PersonalStats.module.scss';

interface PersonalStatsPropsI {
  withdrawOn: string;
}

export const PersonalStats = memo(({ withdrawOn }: PersonalStatsPropsI) => {
  const { t } = useTranslation();

  const { address, chainId } = useAccount();

  const selectedPool = useAtomValue(selectedPoolAtom);
  const withdrawals = useAtomValue(withdrawalsAtom);
  const traderAPI = useAtomValue(traderAPIAtom);
  const triggerUserStatsUpdate = useAtomValue(triggerUserStatsUpdateAtom);
  const isSDKConnected = useAtomValue(sdkConnectedAtom);
  const hasOpenRequestOnChain = useAtomValue(withdrawalOnChainAtom);
  const c2s = useAtomValue(collateralToSettleConversionAtom);
  const flatToken = useAtomValue(flatTokenAtom);
  const [userAmount, setUserAmount] = useAtom(userAmountAtom);

  const [estimatedEarnings, setEstimatedEarnings] = useState<number | null>(null);

  const earningsRequestSentRef = useRef(false);

  const [userPrice, userSymbol] =
    !!flatToken && selectedPool?.poolId === flatToken.poolId && !!flatToken.registeredSymbol
      ? [flatToken.compositePrice ?? 1, flatToken.registeredSymbol]
      : [1, selectedPool?.poolSymbol ?? ''];

  useEffect(() => {
    setUserAmount(null);
    if (selectedPool?.poolSymbol && traderAPI && isSDKConnected && address && isEnabledChain(chainId)) {
      traderAPI.getPoolShareTokenBalance(address, selectedPool.poolSymbol).then((amount) => {
        setUserAmount(amount);
      });
    }
  }, [selectedPool?.poolSymbol, traderAPI, isSDKConnected, address, chainId, triggerUserStatsUpdate, setUserAmount]);

  useEffect(() => {
    if (!selectedPool?.poolSymbol || !address || !isEnabledChain(chainId)) {
      setEstimatedEarnings(null);
      return;
    }

    if (earningsRequestSentRef.current) {
      return;
    }

    earningsRequestSentRef.current = true;

    getEarnings(chainId, address, selectedPool.poolSymbol)
      .then(({ earnings }) => setEstimatedEarnings(earnings < -0.0000000001 ? earnings : Math.max(earnings, 0)))
      .catch((error) => {
        console.error(error);
        setEstimatedEarnings(null);
      })
      .finally(() => {
        earningsRequestSentRef.current = false;
      });

    return () => {
      earningsRequestSentRef.current = false;
    };
  }, [chainId, address, selectedPool?.poolSymbol, triggerUserStatsUpdate]);

  const shareSymbol = `d${selectedPool?.settleSymbol}`;

  return (
    <Box className={styles.root}>
      <Box className={styles.leftColumn}>
        <Box key="amount" className={styles.statContainer}>
          <Box className={styles.statLabel}>
            <InfoLabelBlock
              title={t('pages.vault.personal-stats.amount.title')}
              content={<Typography>{t('pages.vault.personal-stats.amount.info', { shareSymbol })}</Typography>}
            />
          </Box>
          <Typography variant="bodyMedium" className={styles.statValue}>
            {userAmount !== null
              ? formatToCurrency(userAmount, shareSymbol, true, Math.min(valueToFractionDigits(userAmount), 5))
              : '--'}
          </Typography>
        </Box>
        <Box key="estimatedEarnings" className={styles.statContainer}>
          <Box className={styles.statLabel}>
            <InfoLabelBlock
              title={t('pages.vault.personal-stats.earnings.title')}
              content={
                <>
                  <Typography>{t('pages.vault.personal-stats.earnings.info1')}</Typography>
                  <Typography>
                    {t('pages.vault.personal-stats.earnings.info2', { poolSymbol: userSymbol, shareSymbol })}
                  </Typography>
                </>
              }
            />
          </Box>
          <Typography variant="bodyMedium" className={styles.statValue}>
            {estimatedEarnings !== null && selectedPool
              ? formatToCurrency(
                  estimatedEarnings * (c2s.get(selectedPool.poolSymbol)?.value ?? 1) * userPrice,
                  userSymbol,
                  true,
                  Math.min(
                    valueToFractionDigits(
                      estimatedEarnings * (c2s.get(selectedPool.poolSymbol)?.value ?? 1) * userPrice
                    ),
                    5
                  )
                )
              : '--'}
          </Typography>
        </Box>
      </Box>
      <Box className={styles.rightColumn}>
        <Box key="withdrawalInitiated" className={styles.statContainer}>
          <Box className={styles.statLabel}>
            <InfoLabelBlock
              title={t('pages.vault.personal-stats.initiated.title')}
              content={
                <Typography>{t('pages.vault.personal-stats.initiated.info1', { poolSymbol: userSymbol })}</Typography>
              }
            />
          </Box>
          <Typography variant="bodyMedium" className={styles.statValue}>
            {(withdrawals && withdrawals.length > 0) || hasOpenRequestOnChain ? 'Yes' : 'No'}
          </Typography>
        </Box>
        <Box key="withdrawalAmount" className={styles.statContainer}>
          <Box className={styles.statLabel}>
            <InfoLabelBlock
              title={t('pages.vault.personal-stats.withdrawal-amount.title')}
              content={
                <>
                  <Typography>
                    {t('pages.vault.personal-stats.withdrawal-amount.info1', {
                      shareSymbol,
                    })}
                  </Typography>
                  <Typography>{t('pages.vault.personal-stats.withdrawal-amount.info2')}</Typography>
                </>
              }
            />
          </Box>
          <Typography variant="bodyMedium" className={styles.statValue}>
            {withdrawals && withdrawals.length > 0
              ? formatToCurrency(withdrawals[withdrawals.length - 1].shareAmount, shareSymbol)
              : 'N/A'}
          </Typography>
        </Box>
        <Box key="withdrawalDate" className={styles.statContainer}>
          <Box className={styles.statLabel}>
            <InfoLabelBlock
              title={t('pages.vault.personal-stats.date.title')}
              content={
                <>
                  <Typography>{t('pages.vault.personal-stats.date.info1')}</Typography>
                  <Typography>{t('pages.vault.personal-stats.date.info2')}</Typography>
                </>
              }
            />
          </Box>
          <Typography variant="bodyMedium" className={styles.statValue}>
            {withdrawOn}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});
