import classnames from 'classnames';
// import { type ReactNode, Suspense, useMemo } from 'react';
import { type ReactNode } from 'react';

// import { Button } from '@mui/material';
import { InputE } from 'components/responsive-input/enums';
import { ResponsiveInput } from 'components/responsive-input/ResponsiveInput';
import { genericMemo } from 'helpers/genericMemo';
// import { getDynamicLogo } from 'utils/getDynamicLogo';
// import type { TemporaryAnyT } from 'types/types';
import styles from './CustomPriceSelector.module.scss';

interface CustomPriceSelectorPropsI<T extends string> {
  id: string;
  label: ReactNode;
  options: T[];
  translationMap: Record<T, string>;
  handleInputPriceChange: (newValue: string) => void;
  validateInputPrice: () => void;
  handlePriceChange: (key: T) => void;
  selectedInputPrice: number | null | undefined;
  selectedPrice: T | null;
  currency?: string;
  stepSize: string;
  disabled?: boolean;
  inline?: boolean;
  percentComponent?: ReactNode;
}

function CustomPriceSelectorComponent<T extends string>(props: CustomPriceSelectorPropsI<T>) {
  const {
    id,
    label,
    // options,
    // translationMap,
    // handlePriceChange,
    handleInputPriceChange,
    validateInputPrice,
    selectedInputPrice,
    // selectedPrice,
    // currency,
    stepSize,
    disabled = false,
    inline = false,
    percentComponent,
  } = props;

  // const CurrencyIcon = useMemo(() => {
  //   if (!currency) {
  //     return null;
  //   }
  //   return getDynamicLogo(currency.toLowerCase()) as TemporaryAnyT;
  // }, [currency]);

  return (
    <div className={classnames(styles.root, { [styles.inline]: inline })}>
      <div className={styles.labelHolder}>{label}</div>
      <div className={styles.inputHolder}>
        <ResponsiveInput
          id={id}
          className={styles.responsiveInput}
          inputValue={selectedInputPrice != null ? selectedInputPrice : ''}
          placeholder="-"
          step={stepSize}
          min={0}
          setInputValue={handleInputPriceChange}
          handleInputBlur={validateInputPrice}
          disabled={disabled}
          type={inline ? InputE.Regular : InputE.Outlined}
        />
        {percentComponent}
      </div>
      {/*<div className={styles.priceOptions}>
        {options.map((key) => (
          <Button
            key={key}
            variant="outlined"
            className={classnames({ [styles.selected]: key === selectedPrice })}
            onClick={() => handlePriceChange(key)}
            disabled={disabled}
          >
            {translationMap[key]}
          </Button>
        ))}
      </div>*/}
    </div>
  );
}

export const CustomPriceSelector = genericMemo(CustomPriceSelectorComponent);
