import classnames from 'classnames';
import { memo } from 'react';

import { Box } from '@mui/material';

import { SeparatorTypeE } from './enums';

import styles from './Separator.module.scss';

interface SeparatorPropsI {
  className?: string;
  separatorType?: SeparatorTypeE;
}

export const Separator = memo(({ className, separatorType = SeparatorTypeE.Block }: SeparatorPropsI) => {
  return (
    <Box
      className={classnames(styles.root, className, {
        [styles.block]: separatorType === SeparatorTypeE.Block,
        [styles.modal]: separatorType === SeparatorTypeE.Modal,
      })}
    >
      <div className={styles.line}></div>
    </Box>
  );
});
