// src/pages/leaderboard-page/components/leaderboard-table/LeaderboardRow.tsx
import { TableCell, TableRow } from '@mui/material';

import { LeaderboardEntryI } from 'types/types';
import { shortenAddress } from 'utils/shortenAddress';

import styles from './LeaderboardRow.module.scss';

interface LeaderboardRowPropsI {
  entry: LeaderboardEntryI;
}

export const LeaderboardRow = ({ entry }: LeaderboardRowPropsI) => {
  return (
    <TableRow className={styles.row}>
      <TableCell>{entry.rank}</TableCell>
      <TableCell>{shortenAddress(entry.address)}</TableCell>
      <TableCell align="right">{entry.points.toLocaleString()}</TableCell>
    </TableRow>
  );
};