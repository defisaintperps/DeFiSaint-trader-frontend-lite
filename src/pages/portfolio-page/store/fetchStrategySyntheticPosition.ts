import { atom } from 'jotai';
import { type Address } from 'viem';

import { STRATEGY_SYMBOL } from 'appConstants';
import { pagesConfig } from 'config';
import { getPositionRisk } from 'network/network';
import { traderAPIAtom } from 'store/pools.store';
import { STRATEGY_ADDRESSES_LS_KEY } from 'store/strategies.store';
import { type StrategyAddressI } from 'types/types';

export const syntheticPositionUSDAtom = atom<number | null>(null);

export const fetchStrategySyntheticPositionAtom = atom(
  null,
  async (get, set, userAddress: Address, chainId: number) => {
    const strategyAddressesLS = localStorage.getItem(STRATEGY_ADDRESSES_LS_KEY);
    if (!strategyAddressesLS) {
      set(syntheticPositionUSDAtom, null);
      return;
    }
    const strategyAddresses: StrategyAddressI[] = JSON.parse(strategyAddressesLS);

    const traderAPI = get(traderAPIAtom);

    let syntheticPositionUSD = null;
    if (pagesConfig.enabledStrategiesPage) {
      const strategyAddress = strategyAddresses.find(
        ({ userAddress: savedAddress }) => savedAddress === userAddress?.toLowerCase()
      )?.strategyAddress;
      if (strategyAddress) {
        const { data: strategyData } = await getPositionRisk(chainId, traderAPI, strategyAddress, Date.now());

        if (strategyData && strategyData.length > 0) {
          const strategyPosition = strategyData.find(
            ({ symbol, positionNotionalBaseCCY }) => symbol === STRATEGY_SYMBOL && positionNotionalBaseCCY !== 0
          );

          if (strategyPosition) {
            syntheticPositionUSD = strategyPosition.positionNotionalBaseCCY * strategyPosition.entryPrice;
          }
        }
      }
    }

    set(syntheticPositionUSDAtom, syntheticPositionUSD);
  }
);
