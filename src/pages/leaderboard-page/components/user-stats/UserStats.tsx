// src/pages/leaderboard-page/components/user-stats/UserStats.tsx
import { Typography, CircularProgress, Box, Chip } from '@mui/material';
import { InfoOutlined, AccessTime, AllInclusive, CalendarMonth } from '@mui/icons-material';

import { UserLeaderboardStatsI } from 'types/types';

import styles from './UserStats.module.scss';

interface UserStatsPropsI {
  weeklyStats: UserLeaderboardStatsI | null;
  allTimeStats: UserLeaderboardStatsI | null;
  isLoading?: boolean;
}

export const UserStats = ({ weeklyStats, allTimeStats, isLoading = false }: UserStatsPropsI) => {
  const isConnected = !!weeklyStats || !!allTimeStats;

  // Helper function to determine the PNL class
  const getPnlClass = (pnl?: number) => {
    if (pnl === undefined || pnl === null) return '';
    if (pnl > 0) return styles.positive;
    if (pnl < 0) return styles.negative;
    return '';
  };

  // Helper function to format PNL
  const formatPnl = (pnl?: number) => {
    if (pnl === undefined || pnl === null) return 'N/A';
    const prefix = pnl > 0 ? '+' : '-';
    return `${prefix}$${Math.abs(pnl).toFixed(2)}`;
  };

  // Render content based on loading and connection state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className={styles.notConnected}>
          <Typography variant="body1">Connect your wallet to see your stats</Typography>
          <Typography variant="body2" className={styles.helperText}>
            <InfoOutlined fontSize="small" /> Your performance metrics will appear here
          </Typography>
        </div>
      );
    }

    return (
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <div className={styles.statHeader}>
            <AccessTime className={styles.statIcon} />
            <Typography variant="body1" className={styles.statTitle}>
              Weekly Performance
            </Typography>
            <Chip label="This Week" color="primary" variant="outlined" size="small" className={styles.statChip} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statItem}>
              <Typography variant="body2" className={styles.statItemLabel}>
                Rank
              </Typography>
              <Typography variant="h5" className={styles.statValueLarge}>
                #{weeklyStats?.rank || 'N/A'}
              </Typography>
            </div>
            <div className={styles.statItem}>
              <Typography variant="body2" className={styles.statItemLabel}>
                PNL
              </Typography>
              <Typography variant="h5" className={`${styles.statValueLarge} ${getPnlClass(weeklyStats?.pnl)}`}>
                {formatPnl(weeklyStats?.pnl)}
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statHeader}>
            <AllInclusive className={styles.statIcon} />
            <Typography variant="body1" className={styles.statTitle}>
              All-Time Performance
            </Typography>
            <Chip label="All Time" color="secondary" variant="outlined" size="small" className={styles.statChip} />
            {allTimeStats?.numWeeks !== undefined && allTimeStats.numWeeks > 0 && (
              <Chip
                icon={<CalendarMonth fontSize="small" />}
                label={`${allTimeStats.numWeeks} ${allTimeStats.numWeeks === 1 ? 'week' : 'weeks'}`}
                variant="outlined"
                size="small"
                className={styles.weeksChip}
              />
            )}
          </div>
          <div className={styles.statContent}>
            <div className={styles.statItem}>
              <Typography variant="body2" className={styles.statItemLabel}>
                Rank
              </Typography>
              <Typography variant="h5" className={styles.statValueLarge}>
                #{allTimeStats?.rank || 'N/A'}
              </Typography>
            </div>
            <div className={styles.statItem}>
              <Typography variant="body2" className={styles.statItemLabel}>
                PNL
              </Typography>
              <Typography variant="h5" className={`${styles.statValueLarge} ${getPnlClass(allTimeStats?.pnl)}`}>
                {allTimeStats?.points} Points
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Your Performance
      </Typography>

      {renderContent()}
    </Box>
  );
};
