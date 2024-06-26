import type { Dispatch, MouseEvent, SetStateAction } from 'react';

import { Box, TableCell, TableSortLabel, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { TooltipMobile } from 'components/tooltip-mobile/TooltipMobile';
import { genericMemo } from 'helpers/genericMemo';
import { SortOrderE } from 'types/enums';
import type { TableHeaderI } from 'types/types';

import styles from './SortableHeaders.module.scss';

interface SortableHeaderPropsI<T> {
  headers: TableHeaderI<T>[];
  order: SortOrderE;
  orderBy: keyof T;
  setOrder: Dispatch<SetStateAction<SortOrderE>>;
  setOrderBy: Dispatch<SetStateAction<keyof T>>;
}

function SortableHeadersComponent<T>({ headers, orderBy, order, setOrder, setOrderBy }: SortableHeaderPropsI<T>) {
  const handleRequestSort = (_event: MouseEvent<HTMLElement>, property: keyof T) => {
    const isAsc = orderBy === property && order === SortOrderE.Asc;
    setOrder(isAsc ? SortOrderE.Desc : SortOrderE.Asc);
    setOrderBy(property);
  };

  const createSortHandler = (property: keyof T) => (event: MouseEvent<HTMLElement>) => {
    handleRequestSort(event, property);
  };

  return headers.map((header) => {
    const headerLabel = header.tooltip ? (
      <TooltipMobile tooltip={header.tooltip}>
        <Typography variant="bodySmall" className={styles.tooltip}>
          {header.label}
        </Typography>
      </TooltipMobile>
    ) : (
      <Typography variant="bodySmall">{header.label}</Typography>
    );

    return (
      <TableCell
        className={styles.headerLabel}
        key={header.label.toString()}
        align={header.align}
        sortDirection={orderBy === header.field ? order : false}
      >
        {header.field ? (
          <TableSortLabel
            active={orderBy === header.field}
            direction={orderBy === header.field ? order : 'asc'}
            onClick={createSortHandler(header.field)}
            className={styles.sortIcon}
          >
            {headerLabel}
            {orderBy === header.field ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        ) : (
          headerLabel
        )}
      </TableCell>
    );
  });
}

export const SortableHeaders = genericMemo(SortableHeadersComponent);
