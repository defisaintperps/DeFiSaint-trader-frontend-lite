// src/pages/leaderboard-page/components/user-stats/UserStats.tsx
import { useTranslation } from 'react-i18next';

import { CircularProgress, Typography } from '@mui/material';

import { UserLeaderboardStatsI } from 'types/types';
import { shortenAddress } from 'utils/shortenAddress';

import styles from './UserStats.module.scss';

interface UserStatsPropsI {
  userStats: UserLeaderboardStatsI | null;
  isConnected: boolean;
}

export const UserStats = ({ userStats, isConnected }: UserStatsPropsI) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        {t('leaderboard.yourStats')}
      </Typography>
      
      {!isConnected ? (
        <div className={styles.notConnected}>
          <Typography variant="body2">{t('leaderboard.connectWalletToSeeStats')}</Typography>
        </div>
      ) : !userStats ? (
        <div className={styles.loading}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={styles.statsContent}>
          <div className={styles.statItem}>
            <Typography variant="body2" className={styles.label}>{t('leaderboard.address')}:</Typography>
            <Typography variant="body2" className={styles.value}>{shortenAddress(userStats.address)}</Typography>
          </div>
          <div className={styles.statItem}>
            <Typography variant="body2" className={styles.label}>{t('leaderboard.rank')}:</Typography>
            <Typography variant="body2" className={styles.value}>{userStats.rank > 0 ? userStats.rank : '-'}</Typography>
          </div>
          <div className={styles.statItem}>
            <Typography variant="body2" className={styles.label}>{t('leaderboard.d8xPoints')}:</Typography>
            <Typography variant="body2" className={styles.value}>{userStats.points.toLocaleString()}</Typography>
          </div>
          {userStats.pnl !== undefined && (
            <div className={styles.statItem}>
              <Typography variant="body2" className={styles.label}>{t('leaderboard.pnl')}:</Typography>
              <Typography variant="body2" className={styles.value}>{userStats.pnl.toLocaleString()}</Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};