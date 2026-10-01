import React from 'react';
import { Globe, Check } from 'lucide-react';

export type MarketRegion = 'Everywhere' | 'United States' | 'Europe' | 'Asia' | 'Crypto';

interface RegionSelectorProps {
  currentRegion: MarketRegion;
  onSelectRegion: (region: MarketRegion) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  currentRegion,
  onSelectRegion,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const regions: { id: MarketRegion; label: string; desc: string }[] = [
    { id: 'Everywhere', label: 'Everywhere (Global)', desc: 'All world indices, US stocks, crypto, forex' },
    { id: 'United States', label: 'United States', desc: 'S&P 500, Nasdaq 100, Dow Jones, Russell 2000' },
    { id: 'Europe', label: 'Europe', desc: 'DAX Germany, FTSE 100 UK, CAC 40 France, Stoxx 50' },
    { id: 'Asia', label: 'Asia - Pacific', desc: 'Nikkei 225, Hang Seng, Nifty 50, ASX 200' },
    { id: 'Crypto', label: 'Crypto & Digital', desc: 'Bitcoin, Ethereum, Solana, Altcoins' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-start p-4 pt-20">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div 
        className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-gray-800 rounded-3xl shadow-2xl p-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-2 text-[12px] font-bold text-[#787b86] uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-[#2962ff]" />
          <span>Select Market Region</span>
        </div>

        <div className="p-1 space-y-1 mt-1">
          {regions.map((reg) => {
            const isSelected = reg.id === currentRegion;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  onSelectRegion(reg.id);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2962ff]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-200'
                }`}
              >
                <div>
                  <div className="font-bold text-[14px] leading-tight">{reg.label}</div>
                  <div className="text-[11px] text-[#787b86] mt-0.5">{reg.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#2962ff] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
