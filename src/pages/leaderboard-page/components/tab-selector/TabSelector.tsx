// src/pages/leaderboard-page/components/tab-selector/TabSelector.tsx
import classnames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { LeaderboardTabIdE } from 'pages/leaderboard-page/constants';

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
        label: t('leaderboard.weekly'),
      },
      {
        tabId: LeaderboardTabIdE.AllTime,
        label: t('leaderboard.allTime'),
      },
    ],
    [t]
  );

  return (
    <div className={styles.root}>
      {tabItems.map((tab) => (
        <div
          key={tab.tabId}
          onClick={() => onTabChange(tab.tabId)}
          className={classnames(styles.tab, {
            [styles.active]: tab.tabId === activeTab,
            [styles.inactive]: tab.tabId !== activeTab,
          })}
        >
          <Typography variant="bodyMedium">{tab.label}</Typography>
        </div>
      ))}
    </div>
  );
};