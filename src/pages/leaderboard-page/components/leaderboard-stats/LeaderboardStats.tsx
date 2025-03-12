// src/pages/leaderboard-page/components/leaderboard-stats/LeaderboardStats.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import { Typography } from '@mui/material';

import { LeaderboardEntryI, UserLeaderboardStatsI } from 'types/types';

import { LeaderboardTabIdE } from '../../constants';
import { TabSelector } from '../tab-selector/TabSelector';
import { LeaderboardTable } from '../leaderboard-table/LeaderboardTable';
import { UserStats } from '../user-stats/UserStats';

import styles from './LeaderboardStats.module.scss';

interface LeaderboardStatsPropsI {
  weeklyEntries: LeaderboardEntryI[];
  allTimeEntries: LeaderboardEntryI[];
  userStats: UserLeaderboardStatsI | null;
  isLoading: boolean;
}

export const LeaderboardStats = ({ 
  weeklyEntries, 
  allTimeEntries, 
  userStats, 
  isLoading 
}: LeaderboardStatsPropsI) => {
  const { t } = useTranslation();
  const [activeTabId, setActiveTabId] = useState<LeaderboardTabIdE>(LeaderboardTabIdE.Weekly);
  const { address } = useAccount();

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
          <TabSelector 
            activeTab={activeTabId} 
            onTabChange={handleTabChange} 
          />
          
          <LeaderboardTable 
            entries={activeTabId === LeaderboardTabIdE.Weekly ? weeklyEntries : allTimeEntries} 
            isLoading={isLoading}
            isWeekly={activeTabId === LeaderboardTabIdE.Weekly}
          />
        </div>
        
        <div className={styles.statsSection}>
          <UserStats 
            userStats={userStats} 
            isConnected={!!address} 
          />
        </div>
      </div>
    </div>
  );
};