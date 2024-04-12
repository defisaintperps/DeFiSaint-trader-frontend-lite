import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAccount, useChainId, useWaitForTransactionReceipt, useWalletClient } from 'wagmi';
import { Address } from 'viem';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  Link,
  OutlinedInput,
  Typography,
} from '@mui/material';

import { approveMarginToken } from 'blockchain-api/approveMarginToken';
import { deposit } from 'blockchain-api/contract-interactions/deposit';
import { withdraw } from 'blockchain-api/contract-interactions/withdraw';
import { Dialog } from 'components/dialog/Dialog';
import { GasDepositChecker } from 'components/gas-deposit-checker/GasDepositChecker';
import { Separator } from 'components/separator/Separator';
import { SidesRow } from 'components/sides-row/SidesRow';
import { ToastContent } from 'components/toast-content/ToastContent';
import { getTxnLink } from 'helpers/getTxnLink';
import { parseSymbol } from 'helpers/parseSymbol';
import { useDebounce } from 'helpers/useDebounce';
import {
  getAddCollateral,
  getAvailableMargin,
  getRemoveCollateral,
  positionRiskOnCollateralAction,
} from 'network/network';
import { tradingClientAtom } from 'store/app.store';
import {
  poolTokenBalanceAtom,
  poolTokenDecimalsAtom,
  proxyAddrAtom,
  selectedPoolAtom,
  traderAPIAtom,
  traderAPIBusyAtom,
  triggerBalancesUpdateAtom,
} from 'store/pools.store';
import type { MarginAccountI } from 'types/types';
import { formatNumber } from 'utils/formatNumber';
import { formatToCurrency } from 'utils/formatToCurrency';

import { ModifyTypeE, ModifyTypeSelector } from '../../modify-type-selector/ModifyTypeSelector';

import styles from '../Modal.module.scss';

interface ModifyModalPropsI {
  isOpen: boolean;
  selectedPosition?: MarginAccountI | null;
  closeModal: () => void;
}

export const ModifyModal = memo(({ isOpen, selectedPosition, closeModal }: ModifyModalPropsI) => {
  const { t } = useTranslation();

  const proxyAddr = useAtomValue(proxyAddrAtom);
  const selectedPool = useAtomValue(selectedPoolAtom);
  const traderAPI = useAtomValue(traderAPIAtom);
  const poolTokenBalance = useAtomValue(poolTokenBalanceAtom);
  const poolTokenDecimals = useAtomValue(poolTokenDecimalsAtom);
  const tradingClient = useAtomValue(tradingClientAtom);
  const setTriggerBalancesUpdate = useSetAtom(triggerBalancesUpdateAtom);
  const [isAPIBusy, setAPIBusy] = useAtom(traderAPIBusyAtom);

  const chainId = useChainId();
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: chainId });

  const [requestSent, setRequestSent] = useState(false);
  const [modifyType, setModifyType] = useState(ModifyTypeE.Add);
  const [txHashForAdd, setTxHashForAdd] = useState<Address | undefined>(undefined);
  const [amountForAdd, setAmountForAdd] = useState(0);
  const [txHashForRemove, setTxHashForRemove] = useState<Address | undefined>(undefined);
  const [amountForRemove, setAmountForRemove] = useState(0);
  const [symbolForTx, setSymbolForTx] = useState('');
  const [newPositionRisk, setNewPositionRisk] = useState<MarginAccountI | null>();
  const [addCollateral, setAddCollateral] = useState(0);
  const [removeCollateral, setRemoveCollateral] = useState(0);
  const [maxCollateral, setMaxCollateral] = useState<number>();

  const isAPIBusyRef = useRef(isAPIBusy);
  const requestSentRef = useRef(false);

  const {
    isSuccess: isAddSuccess,
    isError: isAddError,
    isFetched: isAddFetched,
    error: addReason,
  } = useWaitForTransactionReceipt({
    hash: txHashForAdd,
    query: { enabled: !!address && !!txHashForAdd },
  });

  useEffect(() => {
    if (!isAddFetched) {
      return;
    }
    setTxHashForAdd(undefined);
    setAmountForAdd(0);
    setSymbolForTx('');
  }, [isAddFetched]);

  useEffect(() => {
    if (!isAddError || !addReason) {
      return;
    }
    toast.error(
      <ToastContent
        title={t('pages.trade.positions-table.toasts.tx-failed.title')}
        bodyLines={[{ label: t('pages.trade.positions-table.toasts.tx-failed.body'), value: addReason.message }]}
      />
    );
  });

  useEffect(() => {
    if (!isAddSuccess || !txHashForAdd) {
      return;
    }
    toast.success(
      <ToastContent
        title={t('pages.trade.positions-table.toasts.collateral-added.title')}
        bodyLines={[
          {
            label: t('pages.trade.positions-table.toasts.collateral-added.body1'),
            value: symbolForTx,
          },
          {
            label: t('pages.trade.positions-table.toasts.collateral-added.body2'),
            value: formatNumber(amountForAdd),
          },
          {
            label: '',
            value: (
              <a
                href={getTxnLink(chain?.blockExplorers?.default?.url, txHashForAdd)}
                target="_blank"
                rel="noreferrer"
                className={styles.shareLink}
              >
                {txHashForAdd}
              </a>
            ),
          },
        ]}
      />
    );
    setTriggerBalancesUpdate((prevValue) => !prevValue);
    // setTimeout(() => {
    // }, 1000);
  }, [isAddSuccess, txHashForAdd, amountForAdd, chain, symbolForTx, t, setTriggerBalancesUpdate]);

  const {
    isSuccess: isRemoveSuccess,
    isError: isRemoveError,
    isFetched: isRemoveFetched,
    error: removeReason,
  } = useWaitForTransactionReceipt({
    hash: txHashForRemove,
    query: { enabled: !!address && !!txHashForRemove },
  });

  useEffect(() => {
    if (!isRemoveFetched) {
      return;
    }
    setTxHashForRemove(undefined);
    setAmountForRemove(0);
    setSymbolForTx('');
  }, [isRemoveFetched]);

  useEffect(() => {
    if (!isRemoveError || !removeReason) {
      return;
    }
    toast.error(
      <ToastContent
        title={t('pages.trade.positions-table.toasts.tx-failed.title')}
        bodyLines={[{ label: t('pages.trade.positions-table.toasts.tx-failed.body'), value: removeReason.message }]}
      />
    );
  }, [isRemoveError, removeReason, t]);

  useEffect(() => {
    if (!isRemoveSuccess || !txHashForRemove) {
      return;
    }
    toast.success(
      <ToastContent
        title={t('pages.trade.positions-table.toasts.collateral-removed.title')}
        bodyLines={[
          {
            label: t('pages.trade.positions-table.toasts.collateral-removed.body1'),
            value: symbolForTx,
          },
          {
            label: t('pages.trade.positions-table.toasts.collateral-removed.body2'),
            value: formatNumber(amountForRemove),
          },
          {
            label: '',
            value: (
              <a
                href={getTxnLink(chain?.blockExplorers?.default?.url, txHashForRemove)}
                target="_blank"
                rel="noreferrer"
                className={styles.shareLink}
              >
                {txHashForRemove}
              </a>
            ),
          },
        ]}
      />
    );
    setTimeout(() => {
      setTriggerBalancesUpdate((prevValue) => !prevValue);
    }, 5000);
  }, [isRemoveSuccess, txHashForRemove, amountForRemove, chain, symbolForTx, t, setTriggerBalancesUpdate]);

  const handleMaxCollateral = () => {
    if (maxCollateral) {
      setRemoveCollateral(maxCollateral);
    }
  };

  const debouncedAddCollateral = useDebounce(addCollateral, 500);

  const debouncedRemoveCollateral = useDebounce(removeCollateral, 500);

  const handleRefreshPositionRisk = useCallback(() => {
    if (!selectedPosition || !address || isAPIBusyRef.current) {
      return;
    }

    if (modifyType === ModifyTypeE.Add && debouncedAddCollateral === 0) {
      return;
    }

    if (modifyType === ModifyTypeE.Remove && debouncedRemoveCollateral === 0) {
      return;
    }

    setAPIBusy(true);
    positionRiskOnCollateralAction(
      chainId,
      traderAPI,
      address,
      modifyType === ModifyTypeE.Add ? debouncedAddCollateral : -debouncedRemoveCollateral,
      selectedPosition
    )
      .then((data) => {
        setAPIBusy(false);
        setNewPositionRisk(data.data.newPositionRisk);
        setMaxCollateral(data.data.availableMargin < 0 ? 0 : data.data.availableMargin * 0.99);
      })
      .catch((err) => {
        console.error(err);
        setAPIBusy(false);
      });
  }, [
    chainId,
    address,
    selectedPosition,
    modifyType,
    debouncedAddCollateral,
    debouncedRemoveCollateral,
    setAPIBusy,
    traderAPI,
  ]);

  useEffect(() => {
    handleRefreshPositionRisk();
  }, [debouncedAddCollateral, debouncedRemoveCollateral, handleRefreshPositionRisk]);

  useEffect(() => {
    setAddCollateral(0);
    setRemoveCollateral(0);
    setModifyType(ModifyTypeE.Add);
  }, [isOpen]);

  useEffect(() => {
    setNewPositionRisk(null);
  }, [modifyType, addCollateral, removeCollateral]);

  useEffect(() => {
    if (!address || !selectedPosition?.symbol || !chainId || isAPIBusy) {
      return;
    }

    if (modifyType === ModifyTypeE.Remove) {
      setAPIBusy(true);
      getAvailableMargin(chainId, traderAPI, selectedPosition.symbol, address).then(({ data }) => {
        setMaxCollateral(data.amount < 0 ? 0 : data.amount * 0.99);
        setAPIBusy(false);
      });
    } else {
      setMaxCollateral(undefined);
    }
  }, [modifyType, chainId, address, selectedPosition?.symbol, setAPIBusy, traderAPI, isAPIBusy]);

  const parsedSymbol = useMemo(() => {
    if (selectedPosition) {
      return parseSymbol(selectedPosition.symbol);
    }
    return null;
  }, [selectedPosition]);

  const calculatedPositionSize = useMemo(() => {
    const size = selectedPosition ? selectedPosition.positionNotionalBaseCCY : 0;
    return formatToCurrency(size, parsedSymbol?.baseCurrency);
  }, [selectedPosition, parsedSymbol]);

  const calculatedMargin = useMemo(() => {
    let margin;
    if (selectedPosition) {
      switch (modifyType) {
        case ModifyTypeE.Add:
          margin = selectedPosition.collateralCC + addCollateral;
          break;
        case ModifyTypeE.Remove:
          margin = selectedPosition.collateralCC - removeCollateral;
          break;
        default:
          margin = selectedPosition.collateralCC;
      }
    } else {
      margin = 0;
    }
    return formatToCurrency(margin, parsedSymbol?.poolSymbol);
  }, [selectedPosition, modifyType, parsedSymbol, addCollateral, removeCollateral]);

  const calculatedLeverage = useMemo(() => {
    if (!selectedPosition) {
      return '-';
    }

    if (modifyType === ModifyTypeE.Add || modifyType === ModifyTypeE.Remove) {
      if (!newPositionRisk) {
        return '-';
      } else {
        return `${formatNumber(newPositionRisk.leverage)}x`;
      }
    }

    return `${formatNumber(selectedPosition.leverage)}x`;
  }, [selectedPosition, newPositionRisk, modifyType]);

  const calculatedLiqPrice = useMemo(() => {
    if (!selectedPosition || selectedPosition.liquidationPrice[0] <= 0) {
      return '-';
    }

    if (modifyType === ModifyTypeE.Add || modifyType === ModifyTypeE.Remove) {
      if (!newPositionRisk || newPositionRisk.liquidationPrice[0] <= 0) {
        return '-';
      } else {
        return formatToCurrency(newPositionRisk.liquidationPrice[0], parsedSymbol?.quoteCurrency);
      }
    }

    return formatToCurrency(selectedPosition.liquidationPrice[0], parsedSymbol?.quoteCurrency);
  }, [selectedPosition, newPositionRisk, modifyType, parsedSymbol]);

  const isConfirmButtonDisabled = useMemo(() => {
    switch (modifyType) {
      case ModifyTypeE.Add:
        return requestSent || addCollateral <= 0 || addCollateral < 0;
      case ModifyTypeE.Remove:
        return requestSent || removeCollateral <= 0 || maxCollateral === undefined || maxCollateral < removeCollateral;
      default:
        return false;
    }
  }, [requestSent, modifyType, addCollateral, removeCollateral, maxCollateral]);

  const handleModifyPositionConfirm = async () => {
    if (requestSentRef.current) {
      return;
    }

    if (
      !selectedPosition ||
      !address ||
      !selectedPool ||
      !proxyAddr ||
      !walletClient ||
      !tradingClient ||
      !poolTokenDecimals
    ) {
      return;
    }

    if (modifyType === ModifyTypeE.Add) {
      requestSentRef.current = true;
      setRequestSent(true);
      getAddCollateral(chainId, traderAPI, selectedPosition.symbol, addCollateral)
        .then(({ data }) => {
          approveMarginToken(
            walletClient,
            selectedPool.marginTokenAddr,
            proxyAddr,
            addCollateral,
            poolTokenDecimals
          ).then(() => {
            deposit(tradingClient, address, data)
              .then((tx) => {
                setTxHashForAdd(tx.hash);
                setAmountForAdd(addCollateral);
                setSymbolForTx(selectedPosition.symbol);
                setTriggerBalancesUpdate((prevValue) => !prevValue);
                toast.success(
                  <ToastContent
                    title={t('pages.trade.positions-table.toasts.adding-collateral.title')}
                    bodyLines={[]}
                  />
                );
              })
              .catch((error) => {
                let msg = (error?.message ?? error) as string;
                msg = msg.length > 30 ? `${msg.slice(0, 25)}...` : msg;
                toast.error(
                  <ToastContent
                    title={t('pages.trade.positions-table.toasts.error-processing.title')}
                    bodyLines={[{ label: t('pages.trade.positions-table.toasts.error-processing.body'), value: msg }]}
                  />
                );
                console.error(error);
              })
              .finally(() => {
                requestSentRef.current = false;
                setRequestSent(false);
                closeModal();
              });
          });
        })
        .catch((error) => {
          console.error(error);
          setRequestSent(false);
          requestSentRef.current = false;
        });
    } else if (modifyType === ModifyTypeE.Remove) {
      if (!maxCollateral || maxCollateral < removeCollateral) {
        return;
      }

      requestSentRef.current = true;
      setRequestSent(true);
      getRemoveCollateral(chainId, traderAPI, selectedPosition.symbol, removeCollateral)
        .then(({ data }) => {
          withdraw(tradingClient, address, data)
            .then((tx) => {
              setTxHashForRemove(tx.hash);
              setAmountForRemove(removeCollateral);
              setSymbolForTx(selectedPosition.symbol);
              setTriggerBalancesUpdate((prevValue) => !prevValue);
              toast.success(
                <ToastContent
                  title={t('pages.trade.positions-table.toasts.removing-collateral.title')}
                  bodyLines={[]}
                />
              );
            })
            .catch((error) => {
              console.error(error);
              let msg = (error?.message ?? error) as string;
              msg = msg.length > 30 ? `${msg.slice(0, 25)}...` : msg;
              toast.error(
                <ToastContent
                  title={t('pages.trade.positions-table.toasts.error-processing.title')}
                  bodyLines={[{ label: t('pages.trade.positions-table.toasts.error-processing.body'), value: msg }]}
                />
              );
            })
            .finally(() => {
              setRequestSent(false);
              requestSentRef.current = false;
              closeModal();
            });
        })
        .catch((error) => {
          console.error(error);
          requestSentRef.current = false;
          setRequestSent(false);
        });
    }
  };

  return (
    <Dialog open={isOpen} className={styles.root}>
      <DialogTitle>{t('pages.trade.positions-table.modify-modal.title')}</DialogTitle>
      <DialogContent>
        <ModifyTypeSelector modifyType={modifyType} setModifyType={setModifyType} />
        <div className={styles.inputBlock}>
          {modifyType === ModifyTypeE.Add && (
            <>
              <SidesRow
                leftSide={t('pages.trade.positions-table.modify-modal.add')}
                rightSide={
                  <OutlinedInput
                    id="add-collateral"
                    endAdornment={
                      <InputAdornment position="end">
                        <Typography variant="adornment">{selectedPool?.poolSymbol}</Typography>
                      </InputAdornment>
                    }
                    type="number"
                    inputProps={{ step: 0.1, min: 0, max: poolTokenBalance }}
                    value={addCollateral}
                    onChange={(event) => setAddCollateral(+event.target.value)}
                  />
                }
              />
              {poolTokenBalance !== undefined && poolTokenBalance > 0 && (
                <SidesRow
                  leftSide=" "
                  rightSide={
                    <Typography className={styles.helperText} variant="bodyTiny">
                      {t('common.max')}{' '}
                      <Link onClick={() => setAddCollateral(poolTokenBalance)}>{formatNumber(poolTokenBalance)}</Link>
                    </Typography>
                  }
                />
              )}
            </>
          )}
          {modifyType === ModifyTypeE.Remove && (
            <>
              <SidesRow
                leftSide={t('pages.trade.positions-table.modify-modal.remove')}
                rightSide={
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="remove-collateral"
                      endAdornment={
                        <InputAdornment position="end">
                          <Typography variant="adornment">{selectedPool?.poolSymbol}</Typography>
                        </InputAdornment>
                      }
                      type="number"
                      inputProps={{ step: 0.1, min: 0, max: maxCollateral }}
                      value={removeCollateral}
                      onChange={(event) => setRemoveCollateral(+event.target.value)}
                    />
                  </FormControl>
                }
              />
              {maxCollateral !== null && maxCollateral !== undefined && (
                <SidesRow
                  leftSide=" "
                  rightSide={
                    <Typography className={styles.helperText} variant="bodyTiny">
                      {t('common.max')} <Link onClick={handleMaxCollateral}>{formatNumber(maxCollateral)}</Link>
                    </Typography>
                  }
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
      <Separator />
      <DialogContent>
        <div className={styles.newPositionHeader}>
          <Typography variant="bodyMedium" className={styles.centered}>
            {t('pages.trade.positions-table.modify-modal.pos-details.title')}
          </Typography>
        </div>
        <div className={styles.newPositionDetails}>
          <SidesRow
            leftSide={t('pages.trade.positions-table.modify-modal.pos-details.size')}
            rightSide={calculatedPositionSize}
          />
          <SidesRow
            leftSide={t('pages.trade.positions-table.modify-modal.pos-details.margin')}
            rightSide={calculatedMargin}
          />
          <SidesRow
            leftSide={t('pages.trade.positions-table.modify-modal.pos-details.leverage')}
            rightSide={calculatedLeverage}
          />
          <SidesRow
            leftSide={t('pages.trade.positions-table.modify-modal.pos-details.liq-price')}
            rightSide={calculatedLiqPrice}
          />
        </div>
      </DialogContent>
      <Separator />
      <DialogActions>
        <Button onClick={closeModal} variant="secondary" size="small">
          {t('pages.trade.positions-table.modify-modal.cancel')}
        </Button>
        <GasDepositChecker>
          <Button
            onClick={handleModifyPositionConfirm}
            variant="primary"
            size="small"
            disabled={isConfirmButtonDisabled}
          >
            {t('pages.trade.positions-table.modify-modal.confirm')}
          </Button>
        </GasDepositChecker>
      </DialogActions>
    </Dialog>
  );
});
