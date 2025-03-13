// src/pages/leaderboard-page/components/tab-selector/TabSelector.tsx
import classnames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Box } from '@mui/material';

import { LeaderboardTabIdE } from '../../constants';

import styles from './TabSelector.module.scss';

interface TabSelectorPropsI {
  activeTab: LeaderboardTabIdE;
  onTabChange: (newIndex: LeaderboardTabIdE) => void;
}

interface TabItemI {
  tabId: LeaderboardTabIdE;
  label: string;
}

export const TabSelector = ({ activeTab, onTabChange }: TabSelectorPropsI) => {
  const { t } = useTranslation();

  const tabItems: TabItemI[] = useMemo(
    () => [
      {
        tabId: LeaderboardTabIdE.Weekly,
        label: t('pages.leaderboard.weekly'),
      },
      {
        tabId: LeaderboardTabIdE.AllTime,
        label: t('pages.leaderboard.allTime'),
      },
    ],
    [t]
  );

  return (
    <Box className={styles.root}>
      {tabItems.map((tab) => (
        <Box
          key={tab.tabId}
          onClick={() => onTabChange(tab.tabId)}
          className={classnames(styles.tab, {
            [styles.active]: tab.tabId === activeTab,
            [styles.inactive]: tab.tabId !== activeTab,
          })}
        >
          <Typography variant="body2">{tab.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};
