import { StopLossE } from '../types/enums';

const mapStopLoss: Record<StopLossE, number> = {
  [StopLossE.None]: 0,
  [StopLossE['5%']]: -0.05,
  [StopLossE['25%']]: -0.25,
  [StopLossE['50%']]: -0.5,
  [StopLossE['75%']]: -0.75,
};

export function mapStopLossToNumber(stopLoss: StopLossE) {
  return mapStopLoss[stopLoss];
}
