export type MarketCategory = 
  | 'Indices'
  | 'Futures'
  | 'Forex'
  | 'Crypto'
  | 'Government bonds'
  | 'Stocks'
  | 'Commodities';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SparklinePoint {
  x: number;
  y: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  subcategory?: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  sparkline: number[];
  badgeText?: string;
  badgeBg?: string;
  iconType?: 'nvidia' | 'apple' | 'microsoft' | 'tesla' | 'amazon' | 'google' | 'meta' | 'flag_us' | 'flag_jp' | 'flag_uk' | 'flag_de' | 'crypto_btc' | 'crypto_eth' | 'crypto_sol' | 'default';
  marketCap?: string;
  exchange?: string;
  high24h?: number;
  low24h?: number;
  week52High?: number;
  week52Low?: number;
  volume?: string;
  avgVolume?: string;
  peRatio?: number;
  divYield?: string;
  beta?: number;
  analystRating?: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';
  targetPrice?: number;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  relatedSymbol?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  readTime: string;
  url?: string;
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}
