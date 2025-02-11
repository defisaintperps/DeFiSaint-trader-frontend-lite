export interface PoolValueI {
  value: number;
  poolSymbol: string;
  poolId: number;
}

export interface PoolShareTokenBalanceI {
  symbol: string;
  balance: number;
  settleSymbol: string;
  poolId: number;
}
