// src/pages/leaderboard-page/components/leaderboard-table/LeaderboardTable.tsx
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';

import { EmptyRow } from 'components/table/empty-row/EmptyRow';
import { SortableHeaders } from 'components/table/sortable-header/SortableHeaders';
import { getComparator, stableSort } from 'helpers/tableSort';
import { LeaderboardEntryI } from 'types/types';
import { AlignE, FieldTypeE, SortOrderE } from 'types/enums';
import { shortenAddress } from 'utils/shortenAddress';

import { LeaderboardRow } from './LeaderboardRow';

import styles from './LeaderboardTable.module.scss';

interface LeaderboardTablePropsI {
  entries: LeaderboardEntryI[];
  isLoading: boolean;
  isWeekly: boolean;
}

export const LeaderboardTable = ({ entries, isLoading, isWeekly }: LeaderboardTablePropsI) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<SortOrderE>(SortOrderE.Asc);
  const [orderBy, setOrderBy] = useState<keyof LeaderboardEntryI>('rank');

  const headers = [
    {
      field: 'rank' as keyof LeaderboardEntryI,
      label: t('leaderboard.rank'),
      align: AlignE.Left,
      type: FieldTypeE.Number,
    },
    {
      field: 'address' as keyof LeaderboardEntryI,
      label: t('leaderboard.address'),
      align: AlignE.Left,
      type: FieldTypeE.String,
    },
    {
      field: 'points' as keyof LeaderboardEntryI,
      label: t('leaderboard.d8xPoints'),
      align: AlignE.Right,
      type: FieldTypeE.Number,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className={styles.emptyContainer}>
        <Typography variant="body1">{t('leaderboard.noEntries')}</Typography>
      </div>
    );
  }

  const sortedEntries = stableSort(entries, getComparator(order, orderBy));

  return (
    <TableContainer className={styles.tableContainer}>
      <MuiTable>
        <TableHead>
          <TableRow>
            <SortableHeaders
              headers={headers}
              order={order}
              orderBy={orderBy}
              setOrder={setOrder}
              setOrderBy={setOrderBy}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEntries.length ? (
            sortedEntries.map((entry) => (
              <LeaderboardRow key={entry.address} entry={entry} />
            ))
          ) : (
            <EmptyRow colSpan={headers.length} />
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};