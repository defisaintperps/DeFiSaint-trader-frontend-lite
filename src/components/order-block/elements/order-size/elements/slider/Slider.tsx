import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { Slider as MuiSlider } from '@mui/material';

import {
  maxOrderSizeAtom,
  orderSizeAtom,
  orderSizeSliderAtom,
  setInputFromOrderSizeAtom,
  setOrderSizeAtom,
} from '../../store';

import styles from './Slider.module.scss';

const multipliers = [0, 0.25, 0.5, 0.75, 1];
const marks = multipliers.map((multiplier) => ({
  value: multiplier * 100,
  label: `${multiplier * 100}%`,
}));

const valueLabelFormat = (value: number) => `${Math.round(value)}%`;

export const Slider = () => {
  const [sliderPercent, setSizeFromSlider] = useAtom(orderSizeSliderAtom);
  const maxOrderSize = useAtomValue(maxOrderSizeAtom);
  const orderSize = useAtomValue(orderSizeAtom);
  const setOrderSize = useSetAtom(setOrderSizeAtom);
  const setInputFromOrderSize = useSetAtom(setInputFromOrderSizeAtom);

  useEffect(() => {
    if (maxOrderSize && maxOrderSize < orderSize) {
      const percent = sliderPercent > 100 ? 100 : sliderPercent;
      const roundedValueBase = setOrderSize((percent * maxOrderSize) / 100);
      setInputFromOrderSize(roundedValueBase);
    }
  }, [maxOrderSize, orderSize, sliderPercent, setOrderSize, setInputFromOrderSize]);

  return (
    <div className={styles.root}>
      <MuiSlider
        aria-label="Order size values"
        value={sliderPercent}
        min={0}
        max={100}
        step={1}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        valueLabelDisplay="auto"
        marks={marks}
        onChange={(_event, newValue) => {
          if (typeof newValue === 'number') {
            setSizeFromSlider(newValue);
          }
        }}
      />
    </div>
  );
};
