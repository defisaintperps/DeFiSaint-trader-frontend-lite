// src/pages/leaderboard-page/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import { Container } from 'components/container/Container';
import { Helmet } from 'components/helmet/Helmet';
import { MaintenanceWrapper } from 'components/maintenance-wrapper/MaintenanceWrapper';
import { 
  getAllTimeLeaderboardEntries, 
  getWeeklyLeaderboardEntries, 
  getUserLeaderboardStats 
} from 'network/network';
import { LeaderboardEntryI, UserLeaderboardStatsI } from 'types/types';

import { LeaderboardStats } from './components/leaderboard-stats/LeaderboardStats';

import styles from './LeaderboardPage.module.scss';

export const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const [weeklyEntries, setWeeklyEntries] = useState<LeaderboardEntryI[]>([]);
  const [allTimeEntries, setAllTimeEntries] = useState<LeaderboardEntryI[]>([]);
  const [userStats, setUserStats] = useState<UserLeaderboardStatsI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const [weeklyData, allTimeData] = await Promise.all([
          getWeeklyLeaderboardEntries(),
          getAllTimeLeaderboardEntries()
        ]);
        
        setWeeklyEntries(weeklyData.entries || []);
        setAllTimeEntries(allTimeData.entries || []);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!address) {
        setUserStats(null);
        return;
      }

      try {
        const stats = await getUserLeaderboardStats(address);
        setUserStats(stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setUserStats(null);
      }
    };

    fetchUserStats();
  }, [address]);

  return (
    <>
      <Helmet title="Leaderboard | D8X App" />
      <div className={styles.root}>
        <MaintenanceWrapper>
          <Container className={styles.container}>
            <LeaderboardStats 
              weeklyEntries={weeklyEntries}
              allTimeEntries={allTimeEntries}
              userStats={userStats}
              isLoading={isLoading}
            />
          </Container>
        </MaintenanceWrapper>
      </div>
    </>
  );
};