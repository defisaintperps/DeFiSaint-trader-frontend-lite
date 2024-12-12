import { config } from 'config';

import { isEnabledChain } from './isEnabledChain';
import { Location } from 'react-router-dom';

export function getEnabledChainId(chainId: number | undefined, location: Location): number {
  const hash = location.hash;
  const chainIdFromUrl = parseInt(hash.split('__')[1]?.split('=')[1], 10);

  if (isEnabledChain(chainId)) {
    return chainId;
  }
  if (chainIdFromUrl && isEnabledChain(chainIdFromUrl)) {
    return chainIdFromUrl;
  }
  return config.enabledChains[0];
}
