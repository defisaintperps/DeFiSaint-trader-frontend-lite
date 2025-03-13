// src/pages/leaderboard-page/components/leaderboard-stats/LeaderboardStats.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { AllTimeLeaderboardEntryI, UserLeaderboardStatsI, WeeklyLeaderboardEntryI } from '../../../../types/types';

import { LeaderboardTabIdE } from '../../constants';
import { TabSelector } from '../tab-selector/TabSelector';
import { LeaderboardTable } from '../leaderboard-table/LeaderboardTable';
import { UserStats } from '../user-stats/UserStats';

import styles from './LeaderboardStats.module.scss';

interface LeaderboardStatsPropsI {
  weeklyEntries: WeeklyLeaderboardEntryI[];
  allTimeEntries: AllTimeLeaderboardEntryI[];
  userStats: UserLeaderboardStatsI | null;
  isLoading: boolean;
}

export const LeaderboardStats = ({ weeklyEntries, allTimeEntries, userStats, isLoading }: LeaderboardStatsPropsI) => {
  const { t } = useTranslation();
  const [activeTabId, setActiveTabId] = useState<LeaderboardTabIdE>(LeaderboardTabIdE.Weekly);
  const isWeeklyEntry = activeTabId === LeaderboardTabIdE.Weekly;

  const handleTabChange = (tabId: LeaderboardTabIdE) => {
    setActiveTabId(tabId);
  };

  return (
    <div className={styles.root}>
      <Typography variant="h4" className={styles.title}>
        {t('leaderboard.title')}
      </Typography>

      <div className={styles.content}>
        <div className={styles.tableSection}>
          <TabSelector activeTab={activeTabId} onTabChange={handleTabChange} />

          <LeaderboardTable
            entries={isWeeklyEntry ? weeklyEntries : allTimeEntries}
            isLoading={isLoading}
            isWeekly={isWeeklyEntry}
          />
        </div>

        <div className={styles.statsSection}>
          <UserStats
            weeklyStats={isWeeklyEntry ? userStats : null}
            allTimeStats={!isWeeklyEntry ? userStats : null}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
