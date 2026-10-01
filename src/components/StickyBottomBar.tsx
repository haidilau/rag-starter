import React, { useState } from 'react';
import { BarChart3, Star, Grid, Newspaper, Wallet, Smartphone, ChevronUp } from 'lucide-react';

interface StickyBottomBarProps {
  onOpenWatchlist: () => void;
  onOpenHeatmap: () => void;
  onOpenNews: () => void;
  onOpenPaperTrading: () => void;
  watchlistCount: number;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  onOpenWatchlist,
  onOpenHeatmap,
  onOpenNews,
  onOpenPaperTrading,
  watchlistCount
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [appPrompt, setAppPrompt] = useState(false);

  const handleOpenInApp = () => {
    setAppPrompt(true);
    setTimeout(() => setAppPrompt(false), 2500);
  };

  return (
    <>
      {/* Quick Menu Popover */}
      {showQuickMenu && (
        <div className="fixed bottom-14 left-4 right-4 z-40 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-gray-800 rounded-2xl shadow-xl p-3 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => {
              setShowQuickMenu(false);
              onOpenWatchlist();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors"
          >
            <Star className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-gray-200">Watchlist</span>
          </button>

          <button
            onClick={() => {
              setShowQuickMenu(false);
              onOpenHeatmap();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors"
          >
            <Grid className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-gray-200">Heatmap</span>
          </button>

          <button
            onClick={() => {
              setShowQuickMenu(false);
              onOpenNews();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors"
          >
            <Newspaper className="w-5 h-5 text-[#2962ff] mb-1" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-gray-200">News</span>
          </button>

          <button
            onClick={() => {
              setShowQuickMenu(false);
              onOpenPaperTrading();
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-center transition-colors"
          >
            <Wallet className="w-5 h-5 text-purple-500 mb-1" />
            <span className="text-[11px] font-bold text-gray-900 dark:text-gray-200">Trading</span>
          </button>
        </div>
      )}

      {/* App Prompt notification */}
      {appPrompt && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-[#131722] text-white px-4 py-2 rounded-full text-[12px] font-bold shadow-lg flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-[#2962ff]" />
          <span>Opening TradingView Web App Experience</span>
        </div>
      )}

      {/* iOS / Mobile Bottom Bar matching screenshot */}
      <aside className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-t border-[#e0e3eb]/80 dark:border-gray-800 py-2.5 px-4 sm:px-6 flex items-center justify-between z-30 text-xs font-medium text-[#787b86] shadow-lg transition-colors">
        <button
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className="flex items-center space-x-1.5 text-[#2962ff] font-semibold hover:opacity-90 transition-opacity"
          type="button"
        >
          <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span>Markets Overview</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showQuickMenu ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-2">
          {watchlistCount > 0 && (
            <button
              onClick={onOpenWatchlist}
              className="flex items-center space-x-1 text-[#131722] dark:text-gray-200 font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-[11px]"
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{watchlistCount}</span>
            </button>
          )}

          <button
            onClick={handleOpenInApp}
            className="text-[#131722] dark:text-gray-200 font-semibold px-3 py-1 bg-gray-100 dark:bg-[#1e222d] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            type="button"
          >
            Open in App
          </button>
        </div>
      </aside>
    </>
  );
};
