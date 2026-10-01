import React from 'react';
import { MarketAsset } from '../types/market';
import { AssetEmblem } from './AssetEmblem';
import { Sparkline } from './Sparkline';
import { X, Star, Trash2, ArrowUpRight, Plus } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onOpenSearch: () => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allAssets,
  onSelectAsset,
  onRemoveFromWatchlist,
  onOpenSearch
}) => {
  if (!isOpen) return null;

  const watchlistedAssets = allAssets.filter((a) =>
    watchlistSymbols.includes(a.symbol)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="font-extrabold text-[18px] text-[#131722] dark:text-white">
              My Watchlist ({watchlistedAssets.length})
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#2962ff] text-white rounded-full text-[12px] font-bold hover:bg-blue-600 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Symbol</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-gray-100 dark:divide-gray-800/60">
          {watchlistedAssets.length === 0 ? (
            <div className="py-16 text-center text-[#787b86]">
              <Star className="w-12 h-12 stroke-[1.2] mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-[16px] font-bold text-gray-900 dark:text-white">Your watchlist is empty</p>
              <p className="text-[13px] mt-1 max-w-xs mx-auto text-[#787b86]">
                Tap the star icon on any market card or detail view to track your favorite instruments here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="mt-4 px-4 py-2 bg-[#2962ff] text-white text-[13px] font-bold rounded-full hover:bg-blue-600 transition-colors"
              >
                Browse Markets
              </button>
            </div>
          ) : (
            watchlistedAssets.map((asset) => {
              const isPos = asset.change >= 0;
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1e222d] transition-colors group"
                >
                  <div
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                    className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <AssetEmblem asset={asset} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[15px] text-[#131722] dark:text-white truncate">
                          {asset.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86] dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-medium">
                          {asset.category}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#787b86] dark:text-gray-400 truncate">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Sparkline mini */}
                  <div className="hidden sm:block w-24 h-8 mx-3">
                    <Sparkline
                      data={asset.sparkline}
                      isPositive={isPos}
                      height={32}
                      width={96}
                      id={`wl-${asset.id}`}
                    />
                  </div>

                  <div className="text-right pl-3 flex items-center space-x-3">
                    <div
                      onClick={() => {
                        onSelectAsset(asset);
                        onClose();
                      }}
                      className="cursor-pointer"
                    >
                      <div className="font-bold text-[15px] text-[#131722] dark:text-white">
                        {asset.currency === 'USD' ? '$' : ''}
                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[12px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromWatchlist(asset.symbol)}
                      title="Remove from watchlist"
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg opacity-80 hover:opacity-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
