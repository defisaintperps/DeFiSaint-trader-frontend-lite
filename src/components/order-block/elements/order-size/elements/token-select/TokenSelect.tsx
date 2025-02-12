import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';

import { ButtonSelect } from 'components/button-select/ButtonSelect';
import { ButtonMenuItem } from 'components/button-select/elements/ButtonMenuItem';
import { DynamicLogo } from 'components/dynamic-logo/DynamicLogo';
import { flatTokenAtom, selectedPerpetualAtom, selectedPoolAtom } from 'store/pools.store';

import { selectedCurrencyAtom } from '../../store';

import styles from './TokenSelect.module.scss';

interface OptionTitlePropsI {
  option: string;
}

const OptionTitle = ({ option }: OptionTitlePropsI) => {
  return (
    <span className={styles.currencyLabel}>
      <DynamicLogo logoName={option.toLowerCase()} width={16} height={16} />
      <span>{option}</span>
    </span>
  );
};

export const TokenSelect = () => {
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);
  const selectedPool = useAtomValue(selectedPoolAtom);
  const selectedPerpetual = useAtomValue(selectedPerpetualAtom);
  const flatToken = useAtomValue(flatTokenAtom);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currencyOptions = useMemo(() => {
    if (!selectedPool || !selectedPerpetual) {
      return [];
    }

    const currencies = [selectedPerpetual.baseCurrency, selectedPerpetual.quoteCurrency];
    if (
      selectedPool.settleSymbol &&
      !currencies.includes(selectedPool.settleSymbol) &&
      (!flatToken || flatToken.poolId !== selectedPool.poolId)
    ) {
      currencies.push(selectedPool.settleSymbol);
    }
    const flatSymbol = flatToken ? (flatToken.registeredSymbol ?? flatToken.supportedTokens[0].symbol) : undefined;
    if (flatToken && flatSymbol && selectedPool.poolId === flatToken.poolId && !currencies.includes(flatSymbol)) {
      currencies.push(flatSymbol);
    }
    return currencies;
  }, [flatToken, selectedPool, selectedPerpetual]);

  return (
    <ButtonSelect
      id="order-size-token-select"
      selectedValue={
        <span className={styles.currencyLabel}>
          <DynamicLogo logoName={selectedCurrency.toLowerCase()} width={16} height={16} />
          <span>{selectedCurrency}</span>
        </span>
      }
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    >
      {currencyOptions.map((option) => (
        <ButtonMenuItem
          key={option}
          option={<OptionTitle option={option} />}
          isActive={option === selectedCurrency}
          onClick={() => {
            setSelectedCurrency(option);
            setAnchorEl(null);
          }}
        />
      ))}
    </ButtonSelect>
  );
};
