import React from 'react';
import { Search, Menu, Moon, Sun, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onGetStarted: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  liveUpdatesActive: boolean;
  onToggleLive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenSearch,
  onGetStarted,
  darkMode,
  onToggleTheme,
  liveUpdatesActive,
  onToggleLive
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-[#e0e3eb]/70 dark:border-gray-800 transition-colors">
      <div className="flex items-center space-x-3.5">
        {/* Hamburger Menu Button */}
        <button
          aria-label="Open Navigation Menu"
          onClick={onOpenMenu}
          className="p-1 -ml-1 text-[#131722] dark:text-gray-200 hover:text-black dark:hover:text-white focus:outline-none transition-colors"
          type="button"
        >
          <Menu className="w-6 h-6 stroke-[2]" />
        </button>

        {/* TradingView Geometric TV Logo */}
        <div className="flex items-center space-x-2 select-none cursor-pointer">
          <svg className="h-6 w-auto text-[#131722] dark:text-white" fill="currentColor" viewBox="0 0 36 28">
            <path d="M0 4C0 1.79086 1.79086 0 4 0H9V20C9 22.2091 7.20914 24 5 24H0V4Z" />
            <path d="M12 0H19.5L14 28H6.5L12 0Z" />
            <path d="M22 0H32C34.2091 0 36 1.79086 36 4V13C36 15.2091 34.2091 17 32 17H22V0Z" />
          </svg>
          <span className="font-extrabold text-[17px] tracking-tight text-[#131722] dark:text-white hidden sm:inline-block">
            TradingView
          </span>
        </div>

        {/* Live Feed status toggle pill */}
        <button
          onClick={onToggleLive}
          title={liveUpdatesActive ? 'Live simulated market feed active' : 'Market feed paused'}
          className="hidden md:flex items-center space-x-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${liveUpdatesActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
          <span>{liveUpdatesActive ? 'LIVE' : 'PAUSED'}</span>
        </button>
      </div>

      {/* Header Actions (Theme, Search & CTA) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Theme switcher */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2 text-[#131722] dark:text-gray-200 hover:text-[#2962ff] dark:hover:text-[#2962ff] rounded-full transition-colors"
          type="button"
        >
          {darkMode ? <Sun className="w-5 h-5 stroke-[2]" /> : <Moon className="w-5 h-5 stroke-[2]" />}
        </button>

        {/* Search Button */}
        <button
          aria-label="Search markets"
          onClick={onOpenSearch}
          className="p-2 text-[#131722] dark:text-gray-200 hover:text-[#2962ff] rounded-full transition-colors"
          type="button"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-center px-4 py-2 text-[14px] font-semibold text-white rounded-full bg-gradient-to-r from-[#2962ff] to-[#802cf6] hover:opacity-95 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          type="button"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
