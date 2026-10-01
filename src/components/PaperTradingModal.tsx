import React, { useState } from 'react';
import { MarketAsset, PortfolioPosition } from '../types/market';
import { AssetEmblem } from './AssetEmblem';
import { X, Wallet, TrendingUp, TrendingDown, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PaperTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: MarketAsset | null;
  allAssets: MarketAsset[];
  cashBalance: number;
  positions: PortfolioPosition[];
  onExecuteTrade: (symbol: string, shares: number, action: 'BUY' | 'SELL', currentPrice: number) => { success: boolean; message: string };
  onSelectAsset: (asset: MarketAsset) => void;
}

export const PaperTradingModal: React.FC<PaperTradingModalProps> = ({
  isOpen,
  onClose,
  selectedAsset,
  allAssets,
  cashBalance,
  positions,
  onExecuteTrade,
  onSelectAsset
}) => {
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio'>('trade');
  const [currentSymbol, setCurrentSymbol] = useState<string>(selectedAsset?.symbol || 'NVDA');
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState<number>(10);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const currentAsset = allAssets.find((a) => a.symbol === currentSymbol) || allAssets[0];
  const position = positions.find((p) => p.symbol === currentSymbol);

  const totalPositionsValue = positions.reduce((acc, p) => acc + p.totalValue, 0);
  const totalPortfolioValue = cashBalance + totalPositionsValue;
  const estimatedCost = (currentAsset ? currentAsset.price : 0) * (shares || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;
    const res = onExecuteTrade(currentAsset.symbol, shares, action, currentAsset.price);
    setFeedback(res);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#2962ff]" />
            <h2 className="font-extrabold text-[18px] text-[#131722] dark:text-white leading-tight">
              Paper Trading Simulator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Summary Card */}
        <div className="p-4 bg-gray-50 dark:bg-[#1a1e29] border-b border-[#e0e3eb] dark:border-gray-800 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#787b86] uppercase">Total Equity</span>
            <div className="text-[20px] font-black text-gray-900 dark:text-white">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#787b86] uppercase">Available Cash</span>
            <div className="text-[20px] font-black text-[#2962ff]">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e0e3eb] dark:border-gray-800">
          <button
            onClick={() => setActiveTab('trade')}
            className={`flex-1 py-3 text-[14px] font-bold text-center border-b-2 transition-colors ${
              activeTab === 'trade'
                ? 'border-[#2962ff] text-[#2962ff]'
                : 'border-transparent text-[#787b86] hover:text-black dark:hover:text-white'
            }`}
          >
            Place Order
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex-1 py-3 text-[14px] font-bold text-center border-b-2 transition-colors ${
              activeTab === 'portfolio'
                ? 'border-[#2962ff] text-[#2962ff]'
                : 'border-transparent text-[#787b86] hover:text-black dark:hover:text-white'
            }`}
          >
            Open Positions ({positions.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'trade' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Asset Selector */}
              <div>
                <label className="text-[12px] font-bold text-[#787b86] uppercase block mb-1.5">
                  Select Instrument
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-[#1e222d] rounded-2xl border border-gray-200 dark:border-gray-700">
                  {currentAsset && <AssetEmblem asset={currentAsset} size="md" />}
                  <div className="flex-1">
                    <select
                      value={currentSymbol}
                      onChange={(e) => setCurrentSymbol(e.target.value)}
                      className="w-full bg-transparent font-bold text-[16px] text-gray-900 dark:text-white outline-none cursor-pointer"
                    >
                      {allAssets.map((a) => (
                        <option key={a.symbol} value={a.symbol} className="dark:bg-[#131722]">
                          {a.symbol} - {a.name} (${a.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Buy / Sell Segmented Control */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAction('BUY')}
                  className={`py-2.5 text-[14px] font-bold rounded-xl transition-all ${
                    action === 'BUY'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-black dark:hover:text-white'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setAction('SELL')}
                  className={`py-2.5 text-[14px] font-bold rounded-xl transition-all ${
                    action === 'SELL'
                      ? 'bg-[#f23645] text-white shadow-xs'
                      : 'text-[#787b86] hover:text-black dark:hover:text-white'
                  }`}
                >
                  SELL
                </button>
              </div>

              {/* Shares input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[12px] font-bold text-[#787b86] uppercase">
                    Quantity
                  </label>
                  {position && (
                    <span className="text-[11px] font-medium text-[#787b86]">
                      Owned: {position.shares} shares
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 bg-gray-50 dark:bg-[#1e222d] border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-[18px] text-gray-900 dark:text-white outline-none"
                />
                <div className="flex space-x-2 mt-2">
                  {[1, 5, 10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setShares(num)}
                      className={`px-3 py-1 rounded-lg text-[12px] font-bold border transition-colors ${
                        shares === num
                          ? 'border-[#2962ff] bg-blue-50 dark:bg-blue-950/40 text-[#2962ff]'
                          : 'border-gray-200 dark:border-gray-700 text-[#787b86] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="p-3 bg-gray-50 dark:bg-[#1a1e29] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1.5 text-[13px]">
                <div className="flex justify-between text-[#787b86]">
                  <span>Execution Price</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${currentAsset?.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#787b86]">
                  <span>Estimated Total</span>
                  <span className="font-bold text-gray-900 dark:text-white text-[15px]">
                    ${estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Feedback toast */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-[13px] font-bold text-center ${
                    feedback.success
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl font-bold text-[15px] text-white shadow-sm transition-transform active:scale-98 ${
                  action === 'BUY'
                    ? 'bg-[#089981] hover:bg-emerald-600'
                    : 'bg-[#f23645] hover:bg-rose-600'
                }`}
              >
                Submit {action} Order for {shares} Shares
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {positions.length === 0 ? (
                <div className="py-12 text-center text-[#787b86]">
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white">No active holdings</p>
                  <p className="text-[12px] mt-1">Place a BUY order to start paper trading.</p>
                </div>
              ) : (
                positions.map((pos) => {
                  const isUp = pos.unrealizedPnL >= 0;
                  return (
                    <div
                      key={pos.symbol}
                      className="p-3.5 bg-gray-50 dark:bg-[#1a1e29] border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-[15px] text-gray-900 dark:text-white">{pos.symbol}</span>
                          <span className="text-[11px] text-[#787b86] font-medium">{pos.shares} shares</span>
                        </div>
                        <div className="text-[12px] text-[#787b86] mt-0.5">
                          Avg: ${pos.avgPrice.toFixed(2)} · Current: ${pos.currentPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-[15px] text-gray-900 dark:text-white">
                          ${pos.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-[12px] font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isUp ? '+' : ''}${pos.unrealizedPnL.toFixed(2)} ({isUp ? '+' : ''}{pos.unrealizedPnLPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
