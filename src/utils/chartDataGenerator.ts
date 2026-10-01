import { CandlePoint } from '../types/market';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export function generateChartPoints(
  currentPrice: number,
  timeframe: Timeframe,
  isPositive: boolean
): CandlePoint[] {
  let count = 30;
  let volatility = 0.008;

  switch (timeframe) {
    case '1D':
      count = 28;
      volatility = 0.004;
      break;
    case '5D':
      count = 35;
      volatility = 0.009;
      break;
    case '1M':
      count = 30;
      volatility = 0.015;
      break;
    case '6M':
      count = 40;
      volatility = 0.025;
      break;
    case '1Y':
      count = 52;
      volatility = 0.035;
      break;
    case 'ALL':
      count = 60;
      volatility = 0.05;
      break;
  }

  // Work backwards from currentPrice
  const points: CandlePoint[] = [];
  let price = currentPrice;
  const trendMultiplier = isPositive ? 0.96 : 1.04;
  const baseStart = currentPrice * trendMultiplier;

  // Generate trend line from baseStart to currentPrice with noise
  const now = Date.now();
  const stepMs = (
    timeframe === '1D' ? 15 * 60 * 1000 :
    timeframe === '5D' ? 2 * 3600 * 1000 :
    timeframe === '1M' ? 24 * 3600 * 1000 :
    timeframe === '6M' ? 4 * 24 * 3600 * 1000 :
    timeframe === '1Y' ? 7 * 24 * 3600 * 1000 :
    14 * 24 * 3600 * 1000
  );

  let tempPrice = baseStart;
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const targetTrend = baseStart + (currentPrice - baseStart) * progress;
    // deterministic pseudo random wave
    const wave = Math.sin(i * 0.7) * (currentPrice * volatility * 0.8) +
                 Math.cos(i * 1.3) * (currentPrice * volatility * 0.5);
    
    // Last point must be exactly currentPrice
    const close = i === count - 1 ? currentPrice : Math.max(1, targetTrend + wave);
    const open = i === 0 ? baseStart : points[i - 1].close;
    const high = Math.max(open, close) + (Math.abs(close - open) * 0.5) + (currentPrice * volatility * 0.2);
    const low = Math.min(open, close) - (Math.abs(close - open) * 0.5) - (currentPrice * volatility * 0.2);
    const volume = Math.floor(100000 + Math.abs(Math.sin(i * 1.5)) * 900000);

    const timestamp = new Date(now - (count - 1 - i) * stepMs);
    const timeLabel = timeframe === '1D' 
      ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });

    points.push({
      time: timeLabel,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    });
  }

  return points;
}
