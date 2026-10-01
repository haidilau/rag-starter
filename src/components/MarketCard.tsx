import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { AssetEmblem } from './AssetEmblem';

interface MarketCardProps {
  asset: MarketAsset;
  onSelect: (asset: MarketAsset) => void;
  variant?: 'featured' | 'world' | 'stock';
  flashDirection?: 'up' | 'down' | null;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  asset,
  onSelect,
  variant = 'featured',
  flashDirection = null
}) => {
  const isPositive = asset.change >= 0;
  const formattedPrice = asset.price.toLocaleString(undefined, {
    minimumFractionDigits: asset.price < 10 ? 2 : (asset.price > 1000 ? 2 : 2),
    maximumFractionDigits: asset.price < 1 ? 4 : 2
  });

  const formattedChange = (isPositive ? '+' : '') + asset.change.toFixed(2);
  const formattedPercent = (isPositive ? '+' : '') + asset.changePercent.toFixed(2) + '%';

  // Dynamic card widths based on variant matching user HTML
  const widthClass = 
    variant === 'featured' ? 'min-w-[270px] w-[270px]' :
    variant === 'world' ? 'min-w-[240px] w-[240px]' :
    'min-w-[230px] w-[230px]';

  const flashClass = flashDirection === 'up' ? 'flash-up' : flashDirection === 'down' ? 'flash-down' : '';

  return (
    <article
      onClick={() => onSelect(asset)}
      role="button"
      tabIndex={0}
      className={`market-card ${widthClass} cursor-pointer bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between select-none ${flashClass}`}
    >
      <div>
        {/* Top Header Row with Icon/Badge & Symbol/Name */}
        <div className="flex items-center space-x-2.5">
          <AssetEmblem asset={asset} size="md" />

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[15px] sm:text-[16px] text-[#131722] dark:text-white leading-snug truncate">
              {variant === 'world' ? asset.symbol : asset.name}
            </h3>
            <div className="text-[12px] font-medium text-[#787b86] dark:text-gray-400 uppercase truncate leading-none">
              {variant === 'world' ? asset.name : asset.symbol}
            </div>
          </div>
        </div>

        {/* Price and Percentage Change Row */}
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[18px] sm:text-[20px] font-bold text-[#131722] dark:text-white tracking-tight">
            {asset.currency === 'USD' && variant === 'stock' ? '$' : ''}
            {formattedPrice}
            {asset.currency === '%' ? '%' : ''}
          </span>
          
          <span
            className={`inline-flex items-center text-[12px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md ${
              isPositive
                ? 'text-[#089981] bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'text-[#f23645] bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {formattedPercent}
          </span>
        </div>

        {/* Sub-price info: dollar change or market cap */}
        {variant === 'featured' && (
          <div className={`text-[11px] font-medium mt-0.5 ${isPositive ? 'text-[#089981] dark:text-emerald-400' : 'text-[#f23645] dark:text-rose-400'}`}>
            {formattedChange} {asset.currency}
          </div>
        )}

        {variant === 'stock' && asset.marketCap && (
          <div className="text-[11px] font-medium text-[#787b86] dark:text-gray-400 mt-0.5">
            Cap: {asset.marketCap}
          </div>
        )}
      </div>

      {/* Mini Sparkline SVG */}
      <div className={`mt-3 ${variant === 'featured' ? 'h-12' : 'h-10'} w-full`}>
        <Sparkline
          data={asset.sparkline}
          isPositive={isPositive}
          id={`${asset.id}-${variant}`}
          height={variant === 'featured' ? 48 : 36}
          width={variant === 'featured' ? 200 : 160}
        />
      </div>
    </article>
  );
};
