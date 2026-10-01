import React, { useState, useEffect, useMemo } from 'react';
import { ALL_ASSETS, MOCK_NEWS } from './data/mockMarkets';
import { MarketAsset, MarketCategory, PortfolioPosition } from './types/market';
import { Header } from './components/Header';
import { CategoryNavigationPills } from './components/CategoryNavigationPills';
import { MarketCard } from './components/MarketCard';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistModal } from './components/WatchlistModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HeatmapModal } from './components/HeatmapModal';
import { NewsModal } from './components/NewsModal';
import { PaperTradingModal } from './components/PaperTradingModal';
import { GetStartedModal } from './components/GetStartedModal';
import { RegionSelector, MarketRegion } from './components/RegionSelector';
import { MarketListViewModal } from './components/MarketListViewModal';
import { StickyBottomBar } from './components/StickyBottomBar';
import { Sparkline } from './components/Sparkline';
import { AssetEmblem } from './components/AssetEmblem';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Flame,
  Newspaper,
  Star,
  Activity
} from 'lucide-react';

const CATEGORIES: MarketCategory[] = [
  'Indices',
  'Futures',
  'Forex',
  'Crypto',
  'Government bonds',
  'Stocks',
  'Commodities'
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tv_theme') === 'dark';
  });

  // Data & Market state
  const [assets, setAssets] = useState<MarketAsset[]>(ALL_ASSETS);
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Indices');
  const [marketRegion, setMarketRegion] = useState<MarketRegion>('Everywhere');
  const [recentFlashes, setRecentFlashes] = useState<Record<string, 'up' | 'down'>>({});
  const [liveUpdatesActive, setLiveUpdatesActive] = useState(true);

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isPaperTradingOpen, setIsPaperTradingOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState(false);
  const [marketListModal, setMarketListModal] = useState<{
    isOpen: boolean;
    title: string;
    assets: MarketAsset[];
  }>({
    isOpen: false,
    title: '',
    assets: []
  });

  // Watchlist in localStorage
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_watchlist');
    return saved ? JSON.parse(saved) : ['SPX', 'NVDA', 'AAPL', 'BTCUSD', 'NI225'];
  });

  // Paper trading balance & positions in localStorage
  const [virtualCash, setVirtualCash] = useState<number>(() => {
    const saved = localStorage.getItem('tv_paper_cash');
    return saved ? JSON.parse(saved) : 100000;
  });

  const [positions, setPositions] = useState<PortfolioPosition[]>(() => {
    const saved = localStorage.getItem('tv_positions');
    return saved
      ? JSON.parse(saved)
      : [
          {
            symbol: 'NVDA',
            name: 'NVIDIA',
            shares: 25,
            avgPrice: 124.5,
            currentPrice: 138.25,
            totalValue: 3456.25,
            unrealizedPnL: 343.75,
            unrealizedPnLPercent: 11.04
          },
          {
            symbol: 'AAPL',
            name: 'Apple',
            shares: 15,
            avgPrice: 220.0,
            currentPrice: 232.15,
            totalValue: 3482.25,
            unrealizedPnL: 182.25,
            unrealizedPnLPercent: 5.52
          }
        ];
  });

  // Handle theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tv_theme', 'light');
    }
  }, [darkMode]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  // Persist paper trading
  useEffect(() => {
    localStorage.setItem('tv_paper_cash', JSON.stringify(virtualCash));
    localStorage.setItem('tv_positions', JSON.stringify(positions));
  }, [virtualCash, positions]);

  // Realistic live simulated ticks
  useEffect(() => {
    if (!liveUpdatesActive) return;

    const interval = setInterval(() => {
      // Pick 1 or 2 random assets to fluctuate subtly
      const randomIndex = Math.floor(Math.random() * assets.length);
      const target = assets[randomIndex];
      const deltaPercent = (Math.random() - 0.49) * 0.25; // -0.12% to +0.13%
      const newPrice = Number(Math.max(0.1, target.price * (1 + deltaPercent / 100)).toFixed(2));
      const direction: 'up' | 'down' = newPrice >= target.price ? 'up' : 'down';
      const newChange = Number((target.change + (newPrice - target.price)).toFixed(2));
      const newChangePercent = Number((target.changePercent + deltaPercent).toFixed(2));
      const newSparkline = [...target.sparkline.slice(1), newPrice];

      setAssets((prev) =>
        prev.map((item) =>
          item.id === target.id
            ? {
                ...item,
                price: newPrice,
                change: newChange,
                changePercent: newChangePercent,
                sparkline: newSparkline
              }
            : item
        )
      );

      setRecentFlashes((prev) => ({ ...prev, [target.id]: direction }));
      setTimeout(() => {
        setRecentFlashes((prev) => {
          const next = { ...prev };
          delete next[target.id];
          return next;
        });
      }, 900);
    }, 3200);

    return () => clearInterval(interval);
  }, [assets, liveUpdatesActive]);

  // Watchlist toggle handler
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Paper trading order execution
  const handleExecuteTrade = (
    symbol: string,
    shares: number,
    action: 'BUY' | 'SELL',
    currentPrice: number
  ) => {
    const totalCost = shares * currentPrice;

    if (action === 'BUY') {
      if (virtualCash < totalCost) {
        return { success: false, message: 'Insufficient cash balance for this order.' };
      }

      setVirtualCash((prev) => prev - totalCost);
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing) {
          const newShares = existing.shares + shares;
          const newAvgPrice = (existing.shares * existing.avgPrice + totalCost) / newShares;
          const totalVal = newShares * currentPrice;
          const pnl = totalVal - newShares * newAvgPrice;
          return prev.map((p) =>
            p.symbol === symbol
              ? {
                  ...p,
                  shares: newShares,
                  avgPrice: Number(newAvgPrice.toFixed(2)),
                  currentPrice,
                  totalValue: Number(totalVal.toFixed(2)),
                  unrealizedPnL: Number(pnl.toFixed(2)),
                  unrealizedPnLPercent: Number(((pnl / (newShares * newAvgPrice)) * 100).toFixed(2))
                }
              : p
          );
        } else {
          const target = assets.find((a) => a.symbol === symbol);
          return [
            ...prev,
            {
              symbol,
              name: target?.name || symbol,
              shares,
              avgPrice: currentPrice,
              currentPrice,
              totalValue: Number(totalCost.toFixed(2)),
              unrealizedPnL: 0,
              unrealizedPnLPercent: 0
            }
          ];
        }
      });
      return { success: true, message: `Successfully bought ${shares} shares of ${symbol}!` };
    } else {
      // SELL
      const existing = positions.find((p) => p.symbol === symbol);
      if (!existing || existing.shares < shares) {
        return { success: false, message: `Cannot sell: you only hold ${existing?.shares || 0} shares.` };
      }

      const proceeds = shares * currentPrice;
      setVirtualCash((prev) => prev + proceeds);
      setPositions((prev) => {
        const remainingShares = existing.shares - shares;
        if (remainingShares <= 0) {
          return prev.filter((p) => p.symbol !== symbol);
        }
        const totalVal = remainingShares * currentPrice;
        const pnl = totalVal - remainingShares * existing.avgPrice;
        return prev.map((p) =>
          p.symbol === symbol
            ? {
                ...p,
                shares: remainingShares,
                totalValue: Number(totalVal.toFixed(2)),
                unrealizedPnL: Number(pnl.toFixed(2)),
                unrealizedPnLPercent: Number(((pnl / (remainingShares * existing.avgPrice)) * 100).toFixed(2))
              }
            : p
        );
      });
      return { success: true, message: `Successfully sold ${shares} shares of ${symbol}!` };
    }
  };

  // Filtered views
  const featuredIndices = useMemo(() => {
    return assets.filter(
      (a) => a.category === 'Indices' && a.subcategory === 'US Indices'
    );
  }, [assets]);

  const worldIndices = useMemo(() => {
    return assets.filter(
      (a) => a.category === 'Indices' && a.subcategory === 'World indices'
    );
  }, [assets]);

  const usStocks = useMemo(() => {
    return assets.filter(
      (a) => a.category === 'Stocks' && a.subcategory === 'US stocks'
    );
  }, [assets]);

  const cryptoAssets = useMemo(() => {
    return assets.filter((a) => a.category === 'Crypto');
  }, [assets]);

  const forexAssets = useMemo(() => {
    return assets.filter((a) => a.category === 'Forex');
  }, [assets]);

  const futuresAssets = useMemo(() => {
    return assets.filter((a) => a.category === 'Futures' || a.category === 'Commodities');
  }, [assets]);

  const bondAssets = useMemo(() => {
    return assets.filter((a) => a.category === 'Government bonds');
  }, [assets]);

  // Handler for symbol clicks from other components
  const handleSelectSymbol = (sym: string) => {
    const found = assets.find((a) => a.symbol === sym);
    if (found) setSelectedAsset(found);
  };

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-[#131722] text-[#131722] dark:text-gray-100 transition-colors">
      {/* Top Header */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGetStarted={() => setIsGetStartedOpen(true)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        liveUpdatesActive={liveUpdatesActive}
        onToggleLive={() => setLiveUpdatesActive(!liveUpdatesActive)}
      />

      <main className="space-y-6">
        {/* Title Section matching user screenshot */}
        <section className="px-4 pt-5 pb-1">
          <button
            onClick={() => setIsRegionSelectorOpen(true)}
            className="inline-flex items-center space-x-2 text-left group focus:outline-none cursor-pointer"
            type="button"
          >
            <h1 className="text-[28px] leading-tight font-extrabold tracking-tight text-[#131722] dark:text-white">
              {marketRegion === 'Everywhere' ? 'Markets, everywhere' : `Markets, ${marketRegion}`}
            </h1>
            <svg
              className="w-5 h-5 mt-1 text-[#131722] dark:text-white stroke-[2.5] transition-transform group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </section>

        {/* Category Navigation Pills */}
        <CategoryNavigationPills
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Featured Indices Cards (Horizontal Scroller) */}
        {(activeCategory === 'Indices' || activeCategory === 'Stocks') && (
          <section className="pl-4">
            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar pr-4 py-1">
              {featuredIndices.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="featured"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* World Indices Section matching screenshot */}
        {(activeCategory === 'Indices' || activeCategory === 'Futures') && (
          <section className="pt-2">
            {/* Section Title Link */}
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'World Indices',
                    assets: worldIndices
                  })
                }
                className="inline-flex items-center space-x-1 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  World indices
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            {/* Horizontal Cards Scroller */}
            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {worldIndices.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="world"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* US Stocks Section matching screenshot */}
        {(activeCategory === 'Indices' || activeCategory === 'Stocks') && (
          <section className="pt-2">
            {/* Section Title with US Flag */}
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'US Stocks & Equities',
                    assets: usStocks
                  })
                }
                className="inline-flex items-center space-x-2 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                {/* US Flag Circle */}
                <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shadow-xs border border-[#e0e3eb] dark:border-gray-700 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path d="M0 0h36v36H0z" fill="#ED2939"></path>
                    <path d="M0 3.3h36v2.8H0zm0 5.5h36v2.8H0zm0 5.6h36v2.8H0zm0 5.5h36v2.8H0zm0 5.6h36v2.8H0zm0 5.5h36v2.8H0z" fill="#FFF"></path>
                    <path d="M0 0h17v19.6H0z" fill="#00247D"></path>
                    <g fill="#FFF">
                      <circle cx="3.5" cy="4" r="1.1"></circle>
                      <circle cx="8.5" cy="4" r="1.1"></circle>
                      <circle cx="13.5" cy="4" r="1.1"></circle>
                      <circle cx="6" cy="9.8" r="1.1"></circle>
                      <circle cx="11" cy="9.8" r="1.1"></circle>
                      <circle cx="3.5" cy="15.6" r="1.1"></circle>
                      <circle cx="8.5" cy="15.6" r="1.1"></circle>
                      <circle cx="13.5" cy="15.6" r="1.1"></circle>
                    </g>
                  </svg>
                </span>
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  US stocks
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            {/* Horizontal Cards Scroller for US Stocks */}
            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {usStocks.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="stock"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Crypto Section */}
        {(activeCategory === 'Crypto' || activeCategory === 'Indices') && (
          <section className="pt-2">
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'Cryptocurrency Markets',
                    assets: cryptoAssets
                  })
                }
                className="inline-flex items-center space-x-2 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ₿
                </div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Crypto leaders
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {cryptoAssets.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="stock"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Forex Section */}
        {(activeCategory === 'Forex' || activeCategory === 'Futures') && (
          <section className="pt-2">
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'Foreign Exchange (Forex)',
                    assets: forexAssets
                  })
                }
                className="inline-flex items-center space-x-2 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  $
                </div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Major Currencies
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {forexAssets.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="world"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Commodities & Futures Section */}
        {(activeCategory === 'Commodities' || activeCategory === 'Futures') && (
          <section className="pt-2">
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'Commodities & Energy',
                    assets: futuresAssets
                  })
                }
                className="inline-flex items-center space-x-2 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Commodities & Energy
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {futuresAssets.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="stock"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Government Bonds Section */}
        {activeCategory === 'Government bonds' && (
          <section className="pt-2">
            <div className="px-4 mb-3">
              <button
                onClick={() =>
                  setMarketListModal({
                    isOpen: true,
                    title: 'Sovereign Debt & Government Bonds',
                    assets: bondAssets
                  })
                }
                className="inline-flex items-center space-x-2 group focus:outline-none cursor-pointer text-left"
                type="button"
              >
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  %
                </div>
                <h2 className="text-[20px] font-bold tracking-tight text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors">
                  Sovereign Yields
                </h2>
                <svg
                  className="w-5 h-5 text-[#131722] dark:text-white group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>

            <div className="flex space-x-3.5 overflow-x-auto no-scrollbar px-4 py-1">
              {bondAssets.map((asset) => (
                <MarketCard
                  key={asset.id}
                  asset={asset}
                  onSelect={setSelectedAsset}
                  variant="world"
                  flashDirection={recentFlashes[asset.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Interactive Feature Banners: Heatmap & Watchlist Shortcut */}
        <section className="px-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Heatmap Card */}
            <div
              onClick={() => setIsHeatmapOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 cursor-pointer hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-[12px] font-bold text-emerald-800 dark:text-emerald-300">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Heatmap</span>
                </div>
                <h3 className="font-bold text-[16px] text-gray-900 dark:text-white mt-1">
                  S&P 500 Market Treemap
                </h3>
                <p className="text-[12px] text-[#787b86] dark:text-gray-400 mt-0.5">
                  Analyze sector strength, tech leaders, and market breadth
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            {/* Breaking News Card */}
            <div
              onClick={() => setIsNewsOpen(true)}
              className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50 cursor-pointer hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-[12px] font-bold text-blue-800 dark:text-blue-300">
                  <Newspaper className="w-4 h-4 text-[#2962ff]" />
                  <span>Market Commentary</span>
                </div>
                <h3 className="font-bold text-[16px] text-gray-900 dark:text-white mt-1">
                  Breaking News Stream
                </h3>
                <p className="text-[12px] text-[#787b86] dark:text-gray-400 mt-0.5">
                  Macro policy, semiconductor catalysts & real-time flows
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#2962ff] text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Breaking News Snippet */}
        <section className="px-4 pt-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] font-bold tracking-tight text-[#131722] dark:text-white">
              Trending Stories
            </h3>
            <button
              onClick={() => setIsNewsOpen(true)}
              className="text-[13px] font-semibold text-[#2962ff] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_NEWS.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => setIsNewsOpen(true)}
                className="p-3.5 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-gray-800 rounded-2xl cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center space-x-2 text-[11px] text-[#787b86] mb-1">
                  <span className="font-bold text-[#2962ff]">{item.source}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                </div>
                <h4 className="font-bold text-[14px] text-[#131722] dark:text-white leading-snug">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Bar matching user screenshot */}
      <StickyBottomBar
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
        onOpenNews={() => setIsNewsOpen(true)}
        onOpenPaperTrading={() => setIsPaperTradingOpen(true)}
        watchlistCount={watchlistSymbols.length}
      />

      {/* Modals & Overlays */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlistSymbols.includes(selectedAsset.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onOpenTrade={(asset) => {
          setSelectedAsset(null);
          setIsPaperTradingOpen(true);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allAssets={assets}
        onSelectAsset={setSelectedAsset}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        allAssets={assets}
        onSelectAsset={setSelectedAsset}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onSelectCategory={setActiveCategory}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenHeatmap={() => setIsHeatmapOpen(true)}
        onOpenNews={() => setIsNewsOpen(true)}
        onOpenPaperTrading={() => setIsPaperTradingOpen(true)}
        virtualBalance={virtualCash}
      />

      <HeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        onSelectSymbol={handleSelectSymbol}
      />

      <NewsModal
        isOpen={isNewsOpen}
        onClose={() => setIsNewsOpen(false)}
        onSelectSymbol={handleSelectSymbol}
      />

      <PaperTradingModal
        isOpen={isPaperTradingOpen}
        onClose={() => setIsPaperTradingOpen(false)}
        selectedAsset={selectedAsset}
        allAssets={assets}
        cashBalance={virtualCash}
        positions={positions}
        onExecuteTrade={handleExecuteTrade}
        onSelectAsset={setSelectedAsset}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

      <RegionSelector
        isOpen={isRegionSelectorOpen}
        onClose={() => setIsRegionSelectorOpen(false)}
        currentRegion={marketRegion}
        onSelectRegion={setMarketRegion}
      />

      <MarketListViewModal
        isOpen={marketListModal.isOpen}
        onClose={() => setMarketListModal({ isOpen: false, title: '', assets: [] })}
        title={marketListModal.title}
        assets={marketListModal.assets}
        onSelectAsset={setSelectedAsset}
        watchlistSymbols={watchlistSymbols}
        onToggleWatchlist={handleToggleWatchlist}
      />
    </div>
  );
}
