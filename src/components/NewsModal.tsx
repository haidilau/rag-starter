import React from 'react';
import { MOCK_NEWS } from '../data/mockMarkets';
import { NewsItem } from '../types/market';
import { X, Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h2 className="font-extrabold text-[18px] text-[#131722] dark:text-white leading-tight">
                Market News & Streams
              </h2>
              <p className="text-[12px] text-[#787b86]">Real-time market insights & breaking headlines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* News Items */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 dark:divide-gray-800/60">
          {MOCK_NEWS.map((item) => (
            <article key={item.id} className="py-4 first:pt-1 last:pb-1">
              <div className="flex items-center space-x-2 text-[12px] text-[#787b86] mb-1.5 font-medium">
                <span className="text-[#2962ff] font-bold">{item.source}</span>
                <span>·</span>
                <span>{item.timeAgo}</span>
                <span>·</span>
                <span>{item.readTime}</span>
              </div>

              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#131722] dark:text-white hover:text-[#2962ff] cursor-pointer transition-colors leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center space-x-2 mt-2.5">
                {item.relatedSymbol && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectSymbol(item.relatedSymbol!);
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-[#131722] dark:text-gray-200 hover:bg-[#2962ff] hover:text-white transition-colors"
                  >
                    <span>${item.relatedSymbol}</span>
                  </button>
                )}
                <span className="text-[11px] text-[#787b86] font-medium bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.sentiment === 'positive'
                      ? 'text-[#089981] bg-emerald-50 dark:bg-emerald-950/40'
                      : item.sentiment === 'negative'
                      ? 'text-[#f23645] bg-rose-50 dark:bg-rose-950/40'
                      : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
