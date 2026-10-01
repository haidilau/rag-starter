import React, { useState, useMemo } from 'react';
import { MarketAsset, CandlePoint } from '../types/market';
import { Timeframe, generateChartPoints } from '../utils/chartDataGenerator';
import { AssetEmblem } from './AssetEmblem';
import {
  X,
  Star,
  Share2,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Activity,
  Layers,
  ArrowUpRight,
  Info,
  Check
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onOpenTrade: (asset: MarketAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onOpenTrade
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const isPositive = asset.change >= 0;

  // Generate historical points for the timeframe
  const points: CandlePoint[] = useMemo(() => {
    return generateChartPoints(asset.price, timeframe, isPositive);
  }, [asset.price, timeframe, isPositive]);

  // Active point when hovering or fallback to last
  const activePoint = hoverIndex !== null && points[hoverIndex] 
    ? points[hoverIndex] 
    : points[points.length - 1];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out ${asset.name} (${asset.symbol}) on TradingView: $${asset.price}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Dimensions for interactive SVG chart
  const width = 600;
  const height = 260;
  const paddingX = 10;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  const minPrice = Math.min(...points.map(p => p.low));
  const maxPrice = Math.max(...points.map(p => p.high));
  const priceRange = maxPrice - minPrice || 1;

  // Coordinates for area chart
  const coords = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((p.close - minPrice) / priceRange) * chartHeight;
    return { x, y };
  });

  let pathD = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = i > 0 ? coords[i - 1] : coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = i < coords.length - 2 ? coords[i + 2] : p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const fillD = `${pathD} L ${paddingX + chartWidth},${height - paddingBottom} L ${paddingX},${height - paddingBottom} Z`;

  // 52-week position
  const week52Low = asset.week52Low || asset.price * 0.7;
  const week52High = asset.week52High || asset.price * 1.3;
  const week52Progress = Math.min(100, Math.max(0, ((asset.price - week52Low) / (week52High - week52Low)) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl bg-white dark:bg-[#131722] text-[#131722] dark:text-gray-100 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-[#e0e3eb] dark:border-gray-800">
          <div className="flex items-center space-x-3 min-w-0">
            <AssetEmblem asset={asset} size="md" />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-[18px] leading-tight truncate">{asset.symbol}</h2>
                <span className="text-[11px] font-semibold text-[#787b86] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  {asset.exchange || 'MARKET'}
                </span>
              </div>
              <p className="text-[12px] text-[#787b86] dark:text-gray-400 truncate leading-none mt-0.5">{asset.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-2 rounded-full transition-colors ${
                isWatchlisted
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              title="Share symbol"
              className="p-2 text-[#787b86] hover:text-[#2962ff] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#787b86] hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Price Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-[32px] font-extrabold tracking-tight">
                  {asset.currency === 'USD' ? '$' : ''}
                  {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {asset.currency === '%' ? '%' : ''}
                </span>
                <span className="text-[13px] font-semibold text-[#787b86] dark:text-gray-400 uppercase">
                  {asset.currency}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className={`inline-flex items-center space-x-1 text-[13px] font-bold ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
                  <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                </span>
                <span className="text-[12px] text-[#787b86]">Today</span>
              </div>
            </div>

            {/* Live point tooltip banner if hovering */}
            {hoverIndex !== null && (
              <div className="text-[12px] bg-gray-100 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-white">
                  ${activePoint.close.toFixed(2)} · {activePoint.time}
                </div>
                <div className="text-[11px] text-[#787b86] space-x-2">
                  <span>H: {activePoint.high.toFixed(2)}</span>
                  <span>L: {activePoint.low.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls: Timeframe pills + Chart Style Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-[#1e222d] p-1 rounded-xl">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-[12px] font-bold rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-white dark:bg-gray-700 text-[#2962ff] shadow-xs'
                      : 'text-[#787b86] dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-[#1e222d] p-1 rounded-xl">
              <button
                onClick={() => setChartType('area')}
                title="Line / Area Chart"
                className={`p-1.5 rounded-lg transition-all ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-gray-700 text-[#2962ff] shadow-xs'
                    : 'text-[#787b86]'
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('candles')}
                title="Candlestick Chart"
                className={`p-1.5 rounded-lg transition-all ${
                  chartType === 'candles'
                    ? 'bg-white dark:bg-gray-700 text-[#2962ff] shadow-xs'
                    : 'text-[#787b86]'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="relative w-full h-[260px] bg-gray-50/50 dark:bg-[#1a1e29]/40 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-2 overflow-hidden select-none">
            {chartType === 'area' ? (
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relativeX = (e.clientX - rect.left) / rect.width;
                  const idx = Math.min(points.length - 1, Math.max(0, Math.round(relativeX * (points.length - 1))));
                  setHoverIndex(idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Horizontal reference gridlines */}
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1={paddingX}
                    x2={width - paddingX}
                    y1={paddingTop + chartHeight * pct}
                    y2={paddingTop + chartHeight * pct}
                    stroke="#e0e3eb"
                    strokeDasharray="3 3"
                    className="dark:stroke-gray-800"
                  />
                ))}

                {/* Area Gradient Fill */}
                <path d={fillD} fill="url(#detailGrad)" />
                {/* Main Stroke */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isPositive ? '#089981' : '#f23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Hover cursor point */}
                {hoverIndex !== null && coords[hoverIndex] && (
                  <g>
                    <line
                      x1={coords[hoverIndex].x}
                      x2={coords[hoverIndex].x}
                      y1={paddingTop}
                      y2={height - paddingBottom}
                      stroke="#787b86"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={coords[hoverIndex].x}
                      cy={coords[hoverIndex].y}
                      r="5"
                      fill={isPositive ? '#089981' : '#f23645'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            ) : (
              // Candlestick rendering
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const relativeX = (e.clientX - rect.left) / rect.width;
                  const idx = Math.min(points.length - 1, Math.max(0, Math.round(relativeX * (points.length - 1))));
                  setHoverIndex(idx);
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {points.map((p, idx) => {
                  const x = paddingX + (idx / (points.length - 1)) * chartWidth;
                  const isCandleUp = p.close >= p.open;
                  const candleColor = isCandleUp ? '#089981' : '#f23645';

                  const yHigh = paddingTop + chartHeight - ((p.high - minPrice) / priceRange) * chartHeight;
                  const yLow = paddingTop + chartHeight - ((p.low - minPrice) / priceRange) * chartHeight;
                  const yOpen = paddingTop + chartHeight - ((p.open - minPrice) / priceRange) * chartHeight;
                  const yClose = paddingTop + chartHeight - ((p.close - minPrice) / priceRange) * chartHeight;

                  const candleTop = Math.min(yOpen, yClose);
                  const candleBodyHeight = Math.max(2, Math.abs(yClose - yOpen));
                  const candleWidth = Math.max(3, chartWidth / points.length - 3);

                  return (
                    <g key={idx}>
                      {/* High-Low Wick */}
                      <line
                        x1={x}
                        x2={x}
                        y1={yHigh}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />
                      {/* Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={candleTop}
                        width={candleWidth}
                        height={candleBodyHeight}
                        fill={isCandleUp ? candleColor : candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Bottom time labels */}
            <div className="absolute bottom-1 inset-x-4 flex justify-between text-[10px] font-medium text-[#787b86]">
              <span>{points[0]?.time}</span>
              <span>{points[Math.floor(points.length / 2)]?.time}</span>
              <span>{points[points.length - 1]?.time}</span>
            </div>
          </div>

          {/* 52-Week Range Bar */}
          <div className="bg-gray-50 dark:bg-[#1e222d] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-[13px] font-bold mb-2">
              <span className="text-[#787b86] dark:text-gray-400">52-Week Range</span>
              <span className="text-gray-900 dark:text-gray-200">
                ${week52Low.toFixed(2)} - ${week52High.toFixed(2)}
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-500 to-[#2962ff] rounded-full"
                style={{ width: `${week52Progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#787b86] mt-1.5 font-medium">
              <span>52W Low (${week52Low.toFixed(2)})</span>
              <span className="font-bold text-[#2962ff]">Current ({week52Progress.toFixed(0)}%)</span>
              <span>52W High (${week52High.toFixed(2)})</span>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-3">Key Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Day High</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  ${(asset.high24h || asset.price * 1.01).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Day Low</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  ${(asset.low24h || asset.price * 0.99).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Volume</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {asset.volume || '18.4M'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Market Cap</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {asset.marketCap || 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">P/E Ratio</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {asset.peRatio ? asset.peRatio.toFixed(1) : '28.4'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Div Yield</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {asset.divYield || '0.75%'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">Beta (1Y)</span>
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">
                  {asset.beta || 1.12}
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1e222d] rounded-xl border border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-[#787b86] font-medium block">1Y Target</span>
                <span className="text-[14px] font-bold text-[#089981]">
                  ${asset.targetPrice || (asset.price * 1.15).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Summary Meter */}
          <div className="bg-gray-50 dark:bg-[#1e222d] p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#2962ff]" />
                <span className="text-[14px] font-bold text-gray-900 dark:text-white">Technical Analysis</span>
              </div>
              <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                {asset.analystRating || 'Strong Buy'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold mb-2">
              <div className="text-rose-600 dark:text-rose-400">Strong Sell</div>
              <div className="text-rose-400">Sell</div>
              <div className="text-gray-400">Neutral</div>
              <div className="text-emerald-400">Buy</div>
              <div className="text-emerald-600 dark:text-emerald-400">Strong Buy</div>
            </div>
            <div className="grid grid-cols-5 gap-1.5 h-2">
              <div className="bg-rose-500 rounded-l-full opacity-40"></div>
              <div className="bg-rose-400 opacity-40"></div>
              <div className="bg-amber-400 opacity-40"></div>
              <div className="bg-emerald-400 opacity-90"></div>
              <div className="bg-emerald-600 rounded-r-full ring-2 ring-emerald-500"></div>
            </div>
          </div>

          {/* Description */}
          {asset.description && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1.5">About {asset.name}</h3>
              <p className="text-[13px] text-[#787b86] dark:text-gray-300 leading-relaxed">
                {asset.description}
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA Bar */}
        <div className="sticky bottom-0 z-10 px-5 py-3.5 bg-white dark:bg-[#131722] border-t border-[#e0e3eb] dark:border-gray-800 flex items-center gap-3">
          <button
            onClick={() => onToggleWatchlist(asset.symbol)}
            className={`flex-1 py-3 px-4 rounded-xl text-[14px] font-semibold flex items-center justify-center space-x-2 border transition-all ${
              isWatchlisted
                ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#131722] dark:text-gray-200'
            }`}
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-500' : ''}`} />
            <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => onOpenTrade(asset)}
            className="flex-1 py-3 px-4 rounded-xl text-[14px] font-bold text-white bg-[#2962ff] hover:bg-blue-600 active:scale-98 transition-all shadow-sm shadow-blue-500/25 flex items-center justify-center space-x-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Paper Trade</span>
          </button>
        </div>
      </div>
    </div>
  );
};
