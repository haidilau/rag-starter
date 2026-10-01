import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { AssetEmblem } from './AssetEmblem';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const popularSymbols = ['NVDA', 'AAPL', 'SPX', 'BTCUSD', 'TSLA', 'NI225'];

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesQuery =
        asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;
      if (filterType === 'All') return true;
      if (filterType === 'Stocks' && asset.category === 'Stocks') return true;
      if (filterType === 'Indices' && asset.category === 'Indices') return true;
      if (filterType === 'Crypto' && asset.category === 'Crypto') return true;
      if (filterType === 'Forex' && asset.category === 'Forex') return true;
      if (filterType === 'Commodities' && (asset.category === 'Commodities' || asset.category === 'Futures')) return true;
      return true;
    });
  }, [allAssets, query, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh] mt-8"
        role="dialog"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center space-x-3 bg-white dark:bg-[#131722]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, stocks, indices, crypto..."
            className="flex-1 bg-transparent text-[16px] text-gray-900 dark:text-white placeholder-[#787b86] outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[13px] font-semibold text-[#2962ff] px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            Cancel
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-[#1a1e29] border-b border-[#e0e3eb] dark:border-gray-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Indices', 'Stocks', 'Crypto', 'Forex', 'Commodities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 text-[12px] font-medium rounded-full whitespace-nowrap transition-colors ${
                filterType === tab
                  ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] font-semibold shadow-xs'
                  : 'text-[#787b86] hover:text-black dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800/60">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-[#787b86]">
              <p className="text-[14px] font-medium">No results found for "{query}"</p>
              <p className="text-[12px] mt-1">Try searching for SPX, NVDA, Apple, or Bitcoin</p>
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPos = asset.change >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1e222d] cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <AssetEmblem asset={asset} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[15px] text-[#131722] dark:text-white truncate">
                          {asset.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase font-medium">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#787b86] dark:text-gray-400 truncate">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-3 shrink-0">
                    <div className="font-bold text-[15px] text-[#131722] dark:text-white">
                      {asset.currency === 'USD' ? '$' : ''}
                      {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[12px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Popular Symbols Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#1e222d] border-t border-[#e0e3eb] dark:border-gray-800 text-[12px] flex items-center justify-between">
          <span className="text-[#787b86] font-medium">Popular:</span>
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {popularSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setQuery(sym)}
                className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md font-semibold text-[#131722] dark:text-gray-200 hover:border-[#2962ff] transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
