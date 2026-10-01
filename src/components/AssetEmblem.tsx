import React from 'react';
import { MarketAsset } from '../types/market';

interface AssetEmblemProps {
  asset: MarketAsset;
  size?: 'sm' | 'md' | 'lg';
}

export const AssetEmblem: React.FC<AssetEmblemProps> = ({ asset, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-[11px]',
    lg: 'w-10 h-10 text-[13px]'
  }[size];

  // Specific logo mappings
  if (asset.iconType === 'nvidia') {
    return (
      <div className={`${sizeClasses} rounded-full bg-[#101010] text-[#76b900] flex items-center justify-center p-1.5 shadow-xs shrink-0`}>
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.74 8.78c-.28.16-.48.45-.55.77-.1.49.2 1 .71 1.05 1.54.14 2.8 1.48 2.8 3.1 0 1.63-1.27 2.97-2.82 3.1-.5.04-.81.56-.7 1.05.07.32.27.61.56.77.29.16.63.19.95.09 2.5-.78 4.31-3.1 4.31-5.01 0-1.92-1.81-4.23-4.31-5.01-.32-.1-.66-.07-.95.09zm10.74 3.7c0-4.66-3.79-8.48-8.48-8.48-2.6 0-5.01 1.18-6.61 3.16-.4.5-.32 1.23.18 1.63.5.4 1.23.32 1.63-.18 1.25-1.55 3.12-2.47 5.15-2.47 3.65 0 6.34 2.99 6.34 6.34s-2.69 6.34-6.34 6.34c-1.96 0-3.76-.87-5-2.35-.4-.48-1.13-.57-1.62-.17-.49.4-.57 1.13-.17 1.62 1.59 1.9 3.89 3.04 6.44 3.04 4.69 0 8.48-3.82 8.48-8.48z"></path>
        </svg>
      </div>
    );
  }

  if (asset.iconType === 'apple') {
    return (
      <div className={`${sizeClasses} rounded-full bg-black text-white flex items-center justify-center p-1.5 shadow-xs shrink-0`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.07 1.72-.94 2.74 1-.02 2.02-.49 2.64-1.24z"></path>
        </svg>
      </div>
    );
  }

  if (asset.iconType === 'microsoft') {
    return (
      <div className={`${sizeClasses} rounded-full bg-white border border-gray-200 dark:border-gray-700 flex items-center justify-center p-1.5 shadow-xs shrink-0`}>
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
          <div className="bg-[#f25022]"></div>
          <div className="bg-[#7fba00]"></div>
          <div className="bg-[#00a4ef]"></div>
          <div className="bg-[#ffb900]"></div>
        </div>
      </div>
    );
  }

  if (asset.iconType === 'tesla') {
    return (
      <div className={`${sizeClasses} rounded-full bg-[#e82127] text-white flex items-center justify-center p-1.5 shadow-xs shrink-0`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5c2.3 0 4.8.4 6.8 1.4l.7-2.1C16.8 2.7 14.4 2.3 12 2.3s-4.8.4-7.5 1.5l.7 2.1c2-1 4.5-1.4 6.8-1.4zm0 4.1c1.5 0 3.3.3 4.6.9l.6-2c-1.6-.7-3.4-1.1-5.2-1.1s-3.6.4-5.2 1.1l.6 2c1.3-.6 3.1-.9 4.6-.9zm1.3 2.8v8.6h-2.6v-8.6c-2.3 0-4.5.3-6.5.9l.4 2c1.7-.5 3.6-.8 5.4-.8h1.4c1.8 0 3.7.3 5.4.8l.4-2c-2-.6-4.2-.9-6.5-.9z"></path>
        </svg>
      </div>
    );
  }

  if (asset.iconType === 'amazon') {
    return (
      <div className={`${sizeClasses} rounded-full bg-[#232f3e] text-[#ff9900] flex items-center justify-center font-black shrink-0`}>
        a
      </div>
    );
  }

  if (asset.iconType === 'google') {
    return (
      <div className={`${sizeClasses} rounded-full bg-white border border-gray-200 dark:border-gray-700 text-[#4285F4] flex items-center justify-center font-bold shrink-0`}>
        G
      </div>
    );
  }

  if (asset.iconType === 'meta') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-tr from-[#0064e0] to-[#0081fb] text-white flex items-center justify-center font-bold shrink-0`}>
        <span className="text-xs">∞</span>
      </div>
    );
  }

  if (asset.iconType === 'crypto_btc') {
    return (
      <div className={`${sizeClasses} rounded-full bg-[#f7931a] text-white flex items-center justify-center font-bold shrink-0`}>
        ₿
      </div>
    );
  }

  if (asset.iconType === 'crypto_eth') {
    return (
      <div className={`${sizeClasses} rounded-full bg-[#627eea] text-white flex items-center justify-center font-bold shrink-0`}>
        Ξ
      </div>
    );
  }

  if (asset.iconType === 'crypto_sol') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black font-black flex items-center justify-center shrink-0`}>
        S
      </div>
    );
  }

  // Fallback to badge text (e.g. 500, 100, 30, 225, 40)
  if (asset.badgeText) {
    return (
      <span
        style={{ backgroundColor: asset.badgeBg || '#1e40af' }}
        className={`${sizeClasses} rounded-full text-white flex items-center justify-center font-bold tracking-tight shadow-xs shrink-0`}
      >
        {asset.badgeText}
      </span>
    );
  }

  // Default initial avatar
  return (
    <div className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold uppercase shrink-0`}>
      {asset.symbol.slice(0, 2)}
    </div>
  );
};
