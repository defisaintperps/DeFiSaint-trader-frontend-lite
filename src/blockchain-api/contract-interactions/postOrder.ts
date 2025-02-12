import { LOB_ABI, TraderInterface } from '@d8x/perpetuals-sdk';
import type { WriteContractParameters, Address, WalletClient, EstimateContractGasParameters } from 'viem';
import { estimateContractGas } from 'viem/actions';

import { getGasLimit } from 'blockchain-api/getGasLimit';
import { getGasPrice } from 'blockchain-api/getGasPrice';
import { orderSubmitted } from 'network/broker';
import { MethodE } from 'types/enums';
import type { OrderI, OrderDigestI } from 'types/types';

export async function postOrder(
  walletClient: WalletClient,
  traderAPI: TraderInterface,
  {
    traderAddr,
    orders,
    signatures,
    brokerData,
    doChain,
  }: { traderAddr: Address; orders: OrderI[]; signatures: string[]; brokerData: OrderDigestI; doChain?: boolean }
): Promise<{ hash: Address; orderIds: string[] }> {
  if (!walletClient.account || walletClient?.chain === undefined) {
    throw new Error('account not connected');
  }
  const scOrders = orders.map((order, idx) => {
    const scOrder = traderAPI.createSmartContractOrder(order, traderAddr);
    scOrder.brokerAddr = brokerData.brokerAddr;
    scOrder.brokerFeeTbps = brokerData.brokerFeeTbps;
    scOrder.brokerSignature = brokerData.brokerSignatures[idx] ?? '0x';
    return scOrder;
  });
  const clientOrders = doChain
    ? TraderInterface.chainOrders(scOrders, brokerData.orderIds)
    : scOrders.map((o) => TraderInterface.fromSmartContratOrderToClientOrder(o));

  const chain = walletClient.chain;
  const gasPrice = await getGasPrice(chain.id);

  // if (brokerData.OrderBookAddr !== traderAPI.getOrderBookAddress(orders[0].symbol)) {
  //   console.log({
  //     orderBook: orders[0].symbol,
  //     bakend: brokerData.OrderBookAddr,
  //     api: traderAPI.getOrderBookAddress(orders[0].symbol),
  //   });
  // }

  const estimateParams: EstimateContractGasParameters = {
    address: traderAPI.getOrderBookAddress(orders[0].symbol) as Address,
    abi: LOB_ABI,
    functionName: 'postOrders',
    args: [clientOrders as never[], signatures],
    account: walletClient.account,
    gasPrice,
  };
  const gasLimit = await estimateContractGas(walletClient, estimateParams)
    .then((gas) => (gas * 150n) / 100n)
    .catch(() => getGasLimit({ chainId: chain.id, method: MethodE.Interact }) * BigInt(orders.length));

  const writeParams: WriteContractParameters = {
    ...estimateParams,
    chain,
    account: walletClient.account,
    gas: gasLimit,
  };
  return walletClient.writeContract(writeParams).then((tx) => {
    // success submitting order to the node - inform backend
    orderSubmitted(chain.id, brokerData.orderIds).then().catch(console.error);
    return { hash: tx, orderIds: brokerData.orderIds };
  });
}
