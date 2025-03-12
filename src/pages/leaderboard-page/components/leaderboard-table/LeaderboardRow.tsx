// src/pages/leaderboard-page/components/leaderboard-table/LeaderboardRow.tsx
import { TableCell, TableRow } from '@mui/material';

import { LeaderboardEntryI } from 'types/types';
import { shortenAddress } from 'utils/shortenAddress';

import styles from './LeaderboardRow.module.scss';

interface LeaderboardRowPropsI {
  entry: LeaderboardEntryI;
  showPoints?: boolean;
}

export const LeaderboardRow = ({ entry, showPoints = false }: LeaderboardRowPropsI) => {
  // Handle both formats: trader (weekly) or address (all-time)
  const addressToDisplay = entry.trader || entry.address || '';

  return (
    <TableRow className={styles.row}>
      <TableCell>{entry.rank}</TableCell>
      <TableCell>{shortenAddress(addressToDisplay)}</TableCell>
      {showPoints && entry.points ? (
        <TableCell align="right">{entry.points.toLocaleString()}</TableCell>
      ) : (
        <TableCell align="right">{entry.pnl.toFixed(2)}</TableCell>
      )}
    </TableRow>
  );
};
