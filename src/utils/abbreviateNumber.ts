export function abbreviateNumber(value: number) {
  const SUFFIXES = ['', 'k', 'm', 'b', 't'];

  if (value >= 1000) {
    const suffixNum = Math.floor(Math.log10(value) / 3);
    const shortValue = parseFloat((value / Math.pow(1000, suffixNum)).toPrecision(2));

    if (shortValue % 1 !== 0) {
      return shortValue.toFixed(1) + SUFFIXES[suffixNum];
    }
    return shortValue + SUFFIXES[suffixNum];
  }
  return value.toFixed(2);
}
