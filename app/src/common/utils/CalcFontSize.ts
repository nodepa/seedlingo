export default function calcFontSize(
  maxSize: number,
  minSize: number,
  steps: number,
  unit: string,
  text: string,
  shrinkThreshold?: number,
): string {
  const stepSize = (maxSize - minSize) / steps;
  const longestWord = text.split(/[- ]/).reduce((currentMax, contender) => {
    return contender.length > currentMax.length ? contender : currentMax;
  });
  if (shrinkThreshold) {
    if (shrinkThreshold < longestWord.length) {
      return `clamp(${minSize}${unit}, ${maxSize - (longestWord.length - shrinkThreshold) * stepSize}${unit}, ${maxSize}${unit})`;
    } else {
      return maxSize + unit;
    }
  } else {
    return `clamp(${minSize}${unit}, ${maxSize + stepSize - longestWord.length * stepSize}${unit}, ${maxSize}${unit})`;
  }
}
