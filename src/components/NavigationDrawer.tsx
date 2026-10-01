import React from 'react';
import { MarketCategory } from '../types/market';
import {
  X,
  TrendingUp,
  Globe,
  Grid,
  Star,
  Newspaper,
  Moon,
  Sun,
  Activity,
  DollarSign,
  Wallet,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onSelectCategory: (category: MarketCategory) => void;
  onOpenWatchlist: () => void;
  onOpenHeatmap: () => void;
  onOpenNews: () => void;
  onOpenPaperTrading: () => void;
  virtualBalance: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  onToggleTheme,
  onSelectCategory,
  onOpenWatchlist,
  onOpenHeatmap,
  onOpenNews,
  onOpenPaperTrading,
  virtualBalance
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white dark:bg-[#131722] text-[#131722] dark:text-gray-100 shadow-2xl flex flex-col z-10 transition-transform duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-auto text-[#131722] dark:text-white" fill="currentColor" viewBox="0 0 36 28">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H9V20C9 22.2091 7.20914 24 5 24H0V4Z" />
              <path d="M12 0H19.5L14 28H6.5L12 0Z" />
              <path d="M22 0H32C34.2091 0 36 1.79086 36 4V13C36 15.2091 34.2091 17 32 17H22V0Z" />
            </svg>
            <span className="font-extrabold text-[18px] tracking-tight">TradingView</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Trading Account Badge */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-[#2962ff]" />
              <span className="text-[12px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
                Paper Trading
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Active
            </span>
          </div>
          <div className="mt-2 text-[20px] font-extrabold text-[#131722] dark:text-white">
            ${virtualBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenPaperTrading();
            }}
            className="mt-2.5 w-full py-1.5 px-3 bg-[#2962ff] text-white text-[12px] font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-xs flex items-center justify-center space-x-1"
          >
            <span>View Positions & Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-[#787b86] px-3 py-1.5 uppercase tracking-wider">
            Markets
          </div>

          <button
            onClick={() => {
              onSelectCategory('Indices');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-[#2962ff]" />
              <span className="font-semibold text-[14px]">Indices & World Markets</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onSelectCategory('Stocks');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-4 h-4 text-[#089981]" />
              <span className="font-semibold text-[14px]">Stocks & Equities</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onSelectCategory('Crypto');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-[14px]">Crypto</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onSelectCategory('Forex');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-[14px]">Forex & Currencies</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="pt-2 text-[11px] font-bold text-[#787b86] px-3 py-1.5 uppercase tracking-wider">
            Features & Tools
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenWatchlist();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-[14px]">Watchlist</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenHeatmap();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Grid className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-[14px]">S&P 500 Heatmap</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenNews();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1e222d] text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Newspaper className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-[14px]">Market News & Insights</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Drawer Footer with Theme Toggle */}
        <div className="p-4 border-t border-[#e0e3eb] dark:border-gray-800 bg-gray-50 dark:bg-[#1a1e29]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-[13px] font-semibold">{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
            </div>
            <button
              onClick={onToggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-[#2962ff]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
