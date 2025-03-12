// src/pages/leaderboard-page/LeaderboardPage.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

import { Container } from 'components/container/Container';
import { Helmet } from 'components/helmet/Helmet';
import { MaintenanceWrapper } from 'components/maintenance-wrapper/MaintenanceWrapper';
import { getAllTimeLeaderboardEntries, getWeeklyLeaderboardEntries, getUserLeaderboardStats } from 'network/network';
import {
  WeeklyLeaderboardEntryI,
  AllTimeLeaderboardEntryI,
  PaginationMetadataI,
  UserLeaderboardStatsI,
} from 'types/types';
import { LeaderboardTabIdE } from './constants';

import { LeaderboardTable } from './components/leaderboard-table/LeaderboardTable';
import { TabSelector } from './components/tab-selector/TabSelector';
import { UserStats } from './components/user-stats/UserStats';

import styles from './LeaderboardPage.module.scss';

// Default pagination settings
const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE = 1;

export const LeaderboardPage = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  // Separate state for weekly and all-time entries
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyLeaderboardEntryI[]>([]);
  const [allTimeEntries, setAllTimeEntries] = useState<AllTimeLeaderboardEntryI[]>([]);
  const [userStats, setUserStats] = useState<UserLeaderboardStatsI | null>(null);

  // Loading states
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(true);
  const [isLoadingAllTime, setIsLoadingAllTime] = useState(true);

  // Pagination states
  const [weeklyPage, setWeeklyPage] = useState(DEFAULT_PAGE);
  const [allTimePage, setAllTimePage] = useState(DEFAULT_PAGE);
  const [weeklyPageSize, setWeeklyPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [allTimePageSize, setAllTimePageSize] = useState(DEFAULT_PAGE_SIZE);

  // Pagination metadata
  const [weeklyPaginationMetadata, setWeeklyPaginationMetadata] = useState<PaginationMetadataI | undefined>();
  const [allTimePaginationMetadata, setAllTimePaginationMetadata] = useState<PaginationMetadataI | undefined>();

  // Tab selection state
  const [activeTab, setActiveTab] = useState<LeaderboardTabIdE>(LeaderboardTabIdE.Weekly);

  // Fetch weekly leaderboard data
  useEffect(() => {
    const fetchWeeklyLeaderboardData = async () => {
      setIsLoadingWeekly(true);
      try {
        const weeklyData = await getWeeklyLeaderboardEntries(weeklyPageSize, weeklyPage);
        setWeeklyEntries(weeklyData.entries || []);
        setWeeklyPaginationMetadata(weeklyData.metadata);
      } catch (error) {
        console.error('Error fetching weekly leaderboard data:', error);
      } finally {
        setIsLoadingWeekly(false);
      }
    };

    fetchWeeklyLeaderboardData();
  }, [weeklyPage, weeklyPageSize]);

  // Fetch all-time leaderboard data
  useEffect(() => {
    const fetchAllTimeLeaderboardData = async () => {
      setIsLoadingAllTime(true);
      try {
        const allTimeData = await getAllTimeLeaderboardEntries(allTimePageSize, allTimePage);
        setAllTimeEntries(allTimeData.entries || []);
        setAllTimePaginationMetadata(allTimeData.metadata);
      } catch (error) {
        console.error('Error fetching all-time leaderboard data:', error);
      } finally {
        setIsLoadingAllTime(false);
      }
    };

    fetchAllTimeLeaderboardData();
  }, [allTimePage, allTimePageSize]);

  // Fetch user stats if address is available
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
        console.error('Error fetching user leaderboard stats:', error);
        setUserStats(null);
      }
    };

    fetchUserStats();
  }, [address]);

  // Handle tab change
  const handleTabChange = (tab: LeaderboardTabIdE) => {
    setActiveTab(tab);
  };

  // Handle page change for active tab
  const handlePageChange = (page: number) => {
    if (activeTab === LeaderboardTabIdE.Weekly) {
      setWeeklyPage(page);
    } else {
      setAllTimePage(page);
    }
  };

  // Handle page size change for active tab
  const handlePageSizeChange = (pageSize: number) => {
    if (activeTab === LeaderboardTabIdE.Weekly) {
      setWeeklyPageSize(pageSize);
      setWeeklyPage(1); // Reset to first page when changing page size
    } else {
      setAllTimePageSize(pageSize);
      setAllTimePage(1); // Reset to first page when changing page size
    }
  };

  return (
    <MaintenanceWrapper>
      <Helmet title={t('leaderboard.title')} />
      <Container>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('leaderboard.title')}</h1>

          {/* User stats section */}
          {address && <UserStats stats={userStats} isWeekly={activeTab === LeaderboardTabIdE.Weekly} />}

          {/* Tab selector */}
          <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Leaderboard table */}
          {activeTab === LeaderboardTabIdE.Weekly ? (
            <LeaderboardTable
              entries={weeklyEntries}
              isLoading={isLoadingWeekly}
              isWeekly={true}
              paginationMetadata={weeklyPaginationMetadata}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : (
            <LeaderboardTable
              entries={allTimeEntries}
              isLoading={isLoadingAllTime}
              isWeekly={false}
              paginationMetadata={allTimePaginationMetadata}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </Container>
    </MaintenanceWrapper>
  );
};
