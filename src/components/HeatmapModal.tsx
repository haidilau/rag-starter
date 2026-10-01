import React from 'react';
import { HEATMAP_SECTORS } from '../data/mockMarkets';
import { MarketAsset } from '../types/market';
import { X, Grid, Info } from 'lucide-react';

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const HeatmapModal: React.FC<HeatmapModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="font-extrabold text-[18px] text-[#131722] dark:text-white leading-tight">
                S&P 500 Market Heatmap
              </h2>
              <p className="text-[12px] text-[#787b86]">Visualizing market performance across major sectors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Heatmap Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEATMAP_SECTORS.map((sector) => {
              const sectorPos = sector.change >= 0;
              return (
                <div
                  key={sector.name}
                  className="bg-gray-50 dark:bg-[#1a1e29] border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[13px] text-gray-900 dark:text-gray-200">
                      {sector.name}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        sectorPos
                          ? 'text-[#089981] bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-[#f23645] bg-rose-50 dark:bg-rose-950/40'
                      }`}
                    >
                      {sectorPos ? '+' : ''}{sector.change}%
                    </span>
                  </div>

                  {/* Stock blocks in this sector */}
                  <div className="grid grid-cols-3 gap-1.5 flex-1">
                    {sector.items.map((stock) => {
                      const isUp = stock.change >= 0;
                      // Dynamic green/red intensity
                      const bgStyle = isUp
                        ? (stock.change > 2 ? 'bg-[#089981] text-white' : 'bg-emerald-600/90 text-white')
                        : (stock.change < -2 ? 'bg-[#f23645] text-white' : 'bg-rose-600/90 text-white');

                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => {
                            onClose();
                            onSelectSymbol(stock.symbol);
                          }}
                          className={`${bgStyle} rounded-xl p-2 flex flex-col justify-between items-center text-center transition-transform hover:scale-102 active:scale-98 shadow-xs cursor-pointer min-h-[64px]`}
                        >
                          <span className="font-black text-[13px] leading-tight">{stock.symbol}</span>
                          <span className="text-[11px] font-bold opacity-90">
                            {isUp ? '+' : ''}{stock.change.toFixed(2)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-3 bg-gray-50 dark:bg-[#1a1e29] border-t border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Tap any block to inspect full chart</span>
          <div className="flex items-center space-x-1 font-semibold">
            <span className="text-[#f23645]">-3%</span>
            <div className="w-16 h-2 rounded bg-gradient-to-r from-[#f23645] via-gray-300 to-[#089981]"></div>
            <span className="text-[#089981]">+3%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
