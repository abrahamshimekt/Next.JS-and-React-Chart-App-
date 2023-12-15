interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

export function calculateRegression(
  data: Array<[number, number]>
): RegressionResult {
  let n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0,
    sumYY = 0;

  data.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const totalSS = sumYY - (sumY * sumY) / n;

  const resSS = totalSS - (slope * sumXY - (slope * (sumX * sumY)) / n);

  const rSquared = 1 - resSS / totalSS;

  return { slope, intercept, rSquared };
}
