import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { AssetEmblem } from './AssetEmblem';
import { Sparkline } from './Sparkline';
import { X, ArrowUpDown, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface MarketListViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const MarketListViewModal: React.FC<MarketListViewModalProps> = ({
  isOpen,
  onClose,
  title,
  assets,
  onSelectAsset,
  watchlistSymbols,
  onToggleWatchlist
}) => {
  const [sortKey, setSortKey] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  const sortedAssets = [...assets].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'symbol') diff = a.symbol.localeCompare(b.symbol);
    else if (sortKey === 'price') diff = a.price - b.price;
    else diff = a.changePercent - b.changePercent;
    return sortAsc ? diff : -diff;
  });

  const handleSort = (key: 'symbol' | 'price' | 'changePercent') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[88vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-[18px] text-[#131722] dark:text-white leading-tight">
              {title}
            </h2>
            <p className="text-[12px] text-[#787b86]">Full market screener & quote performance</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sort Controls Bar */}
        <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#1a1e29] border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between text-[12px] font-bold text-[#787b86]">
          <button
            onClick={() => handleSort('symbol')}
            className="flex items-center space-x-1 hover:text-[#2962ff] transition-colors"
          >
            <span>Instrument</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleSort('price')}
              className="flex items-center space-x-1 hover:text-[#2962ff] transition-colors"
            >
              <span>Price</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleSort('changePercent')}
              className="flex items-center space-x-1 hover:text-[#2962ff] transition-colors"
            >
              <span>Change</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800/60">
          {sortedAssets.map((asset) => {
            const isPos = asset.change >= 0;
            const isSaved = watchlistSymbols.includes(asset.symbol);

            return (
              <div
                key={asset.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1e222d] transition-colors group cursor-pointer"
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <AssetEmblem asset={asset} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-[15px] text-[#131722] dark:text-white truncate">
                        {asset.symbol}
                      </span>
                      <span className="text-[11px] font-semibold text-[#787b86] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase">
                        {asset.exchange || 'INDEX'}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#787b86] truncate">
                      {asset.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:block w-20 h-7">
                    <Sparkline
                      data={asset.sparkline}
                      isPositive={isPos}
                      height={28}
                      width={80}
                      id={`lst-${asset.id}`}
                    />
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-[15px] text-[#131722] dark:text-white">
                      {asset.currency === 'USD' ? '$' : ''}
                      {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[12px] font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(asset.symbol);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSaved ? 'text-amber-500 fill-amber-500' : 'text-gray-300 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
