import { atom } from 'jotai';

import { CurrencyItemI } from '../components/currency-selector/types';
import { flatTokenAtom, selectedPoolAtom } from './pools.store';

export const accountModalOpenAtom = atom(false);
export const modalSelectedCurrencyAtom = atom<CurrencyItemI | null>(null);

export const oneClickModalOpenAtom = atom(false);
export const connectModalOpenAtom = atom(false);
export const cedeModalOpenAtom = atom(false);
export const withdrawModalOpenAtom = atom(false);
export const extractSocialPKModalOpenAtom = atom(false);
export const extractOctPKModalOpenAtom = atom(false);
export const stopLossModalOpenAtom = atom(false);
export const takeProfitModalOpenAtom = atom(false);
export const marketSelectModalOpenAtom = atom(false);
export const tradeHistoryModalOpenAtom = atom(false);
export const flatTokentModalOpenAtom = atom(false);

const depositModalOpenPrimitiveAtom = atom(false);
export const depositModalOpenAtom = atom(
  (get) => get(depositModalOpenPrimitiveAtom),
  (get, set, value: boolean) => {
    const flatToken = get(flatTokenAtom);
    const selectedPool = get(selectedPoolAtom);
    if (value && flatToken?.isFlatToken && !flatToken?.registeredToken && selectedPool?.poolId === flatToken.poolId) {
      console.log({ value, flatToken, selectedPoolId: selectedPool?.poolId });
      set(flatTokentModalOpenAtom, true);
      set(depositModalOpenPrimitiveAtom, false);
    } else {
      console.log({ value, flatToken, selectedPoolId: selectedPool?.poolId });
      set(depositModalOpenPrimitiveAtom, value);
    }
  }
);
