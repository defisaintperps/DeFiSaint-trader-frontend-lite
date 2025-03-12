// src/pages/leaderboard-page/components/leaderboard-table/LeaderboardTable.tsx
import React, { useCallback, useMemo, useState } from 'react';
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
  TablePagination,
  Box,
} from '@mui/material';

import { EmptyRow } from 'components/table/empty-row/EmptyRow';
import { SortableHeaders } from 'components/table/sortable-header/SortableHeaders';
import { getComparator, stableSort } from 'helpers/tableSort';
import { AllTimeLeaderboardEntryI, PaginationMetadataI, WeeklyLeaderboardEntryI } from 'types/types';
import { AlignE, FieldTypeE, SortOrderE } from 'types/enums';
import { shortenAddress } from 'utils/shortenAddress';

import { LeaderboardRow } from './LeaderboardRow';

import styles from './LeaderboardTable.module.scss';

// Using a more specific prop type for the entries based on whether it's weekly or all-time
type LeaderboardEntry = WeeklyLeaderboardEntryI | AllTimeLeaderboardEntryI;

interface LeaderboardTablePropsI {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  isWeekly: boolean;
  paginationMetadata?: PaginationMetadataI;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// Define a type for column headers to avoid TypeScript errors
interface ColumnHeaderI {
  field: string;
  label: string;
  align: AlignE;
  type: FieldTypeE;
}

export const LeaderboardTable = ({
  entries,
  isLoading,
  isWeekly,
  paginationMetadata,
  onPageChange,
  onPageSizeChange,
}: LeaderboardTablePropsI) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<SortOrderE>(SortOrderE.Asc);
  const [orderBy, setOrderBy] = useState<keyof LeaderboardEntry>('rank');

  const headers = useMemo(() => {
    const baseHeaders: ColumnHeaderI[] = [
      {
        field: 'rank',
        label: t('leaderboard.rank'),
        align: AlignE.Left,
        type: FieldTypeE.Number,
      },
      {
        // Use a generic field name for the address column since the API uses different field names
        field: isWeekly ? 'trader' : 'address',
        label: t('leaderboard.address'),
        align: AlignE.Left,
        type: FieldTypeE.String,
      },
    ];

    // Add the appropriate value column based on whether we're showing weekly or all-time data
    if (isWeekly) {
      baseHeaders.push({
        field: 'pnl',
        label: t('leaderboard.pnl'),
        align: AlignE.Right,
        type: FieldTypeE.Number,
      });
    } else {
      // All-time view shows both PNL and points
      baseHeaders.push({
        field: 'pnl',
        label: t('leaderboard.pnl'),
        align: AlignE.Right,
        type: FieldTypeE.Number,
      });
      baseHeaders.push({
        field: 'points',
        label: t('leaderboard.points'),
        align: AlignE.Right,
        type: FieldTypeE.Number,
      });
    }

    return baseHeaders;
  }, [t, isWeekly]);

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
    <Box sx={{ width: '100%' }}>
      <TableContainer className={styles.tableContainer}>
        <MuiTable>
          <TableHead>
            <TableRow>
              <SortableHeaders
                headers={headers}
                order={order}
                orderBy={orderBy as string}
                setOrder={setOrder}
                setOrderBy={setOrderBy as (property: string) => void}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.length ? (
              sortedEntries.map((entry, index) => (
                <LeaderboardRow
                  key={`${index}-${isWeekly ? (entry as WeeklyLeaderboardEntryI).trader : (entry as AllTimeLeaderboardEntryI).address}`}
                  entry={entry}
                  showPoints={!isWeekly}
                />
              ))
            ) : (
              <EmptyRow colSpan={headers.length} text={t('leaderboard.noEntries')} />
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {paginationMetadata && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={paginationMetadata.totalEntries}
          rowsPerPage={paginationMetadata.pageSize}
          page={paginationMetadata.currentPage - 1}
          onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onPageSizeChange(parseInt(event.target.value, 10))
          }
        />
      )}
    </Box>
  );
};
