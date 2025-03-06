import { memo, useEffect } from 'react';
import { useAccount, useConnect, useReadContracts } from 'wagmi';
import { type Address, erc20Abi, formatUnits } from 'viem';

import { REFETCH_BALANCES_INTERVAL } from 'appConstants';
import { AssetLine } from 'components/asset-line/AssetLine';
import { PoolWithIdI } from 'types/types';
import { valueToFractionDigits } from 'utils/formatToCurrency';
import { flatTokenAbi } from 'blockchain-api/contract-interactions/flatTokenAbi';
import { useAtomValue } from 'jotai';
import { flatTokenAtom } from 'store/pools.store';

interface PoolLinePropsI {
  pool: PoolWithIdI;
  showEmpty?: boolean;
}

export const PoolLine = memo(({ pool, showEmpty = true }: PoolLinePropsI) => {
  const { address, isConnected } = useAccount();
  const { isPending } = useConnect();
  const flatToken = useAtomValue(flatTokenAtom);

  const { data: tokenBalanceData, refetch } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: pool.settleTokenAddr as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        address: pool.settleTokenAddr as Address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: pool.settleTokenAddr as Address,
        abi: flatTokenAbi,
        functionName: 'effectiveBalanceOf',
        args: [address as Address],
      },
      {
        address: pool.settleTokenAddr as Address,
        abi: flatTokenAbi,
        functionName: 'getSupportedTokens',
      },
    ],
    query: {
      enabled: address && pool.settleTokenAddr !== undefined && !isPending && isConnected,
    },
  });

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const intervalId = setInterval(() => {
      refetch().then();
    }, REFETCH_BALANCES_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [refetch, isConnected]);

  if (!showEmpty && tokenBalanceData?.[0]?.result === 0n) {
    return null;
  }

  const tokenBalance =
    tokenBalanceData?.[2].status === 'success' ? tokenBalanceData?.[2].result : tokenBalanceData?.[0].result;
  const unroundedSCValue =
    tokenBalanceData?.[1].status === 'success' && tokenBalance !== undefined
      ? +formatUnits(tokenBalance, tokenBalanceData[1].result)
      : 1;
  const numberDigits = valueToFractionDigits(unroundedSCValue);

  const [userPrice, userSymbol] =
    !!flatToken && pool.poolId === flatToken.poolId
      ? [flatToken.compositePrice ?? 1, flatToken.registeredSymbol ?? flatToken.supportedTokens[0].symbol]
      : [1, pool.settleSymbol];

  return (
    <AssetLine
      symbol={userSymbol}
      value={
        tokenBalance !== undefined && tokenBalanceData?.[1].status === 'success'
          ? (+formatUnits(tokenBalance, tokenBalanceData[1].result) * userPrice).toFixed(numberDigits)
          : ''
      }
    />
  );
});
