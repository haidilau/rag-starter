import React, { useState } from 'react';
import { X, Check, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSignedUp(true);
      setTimeout(() => {
        setSignedUp(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#131722] rounded-3xl shadow-2xl border border-[#e0e3eb] dark:border-gray-800 overflow-hidden flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-auto text-[#131722] dark:text-white" fill="currentColor" viewBox="0 0 36 28">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H9V20C9 22.2091 7.20914 24 5 24H0V4Z" />
              <path d="M12 0H19.5L14 28H6.5L12 0Z" />
              <path d="M22 0H32C34.2091 0 36 1.79086 36 4V13C36 15.2091 34.2091 17 32 17H22V0Z" />
            </svg>
            <span className="font-extrabold text-[18px] text-[#131722] dark:text-white">Join 60M+ Traders</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787b86] hover:text-black dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {signedUp ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-[#089981]">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 dark:text-white">Welcome aboard!</h3>
              <p className="text-[13px] text-[#787b86]">Your 30-day Free Trial is active. Real-time data unlocked.</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-[22px] font-extrabold text-[#131722] dark:text-white leading-tight">
                  Supercharge your trading with real-time markets
                </h3>
                <p className="text-[13px] text-[#787b86] mt-1.5 leading-relaxed">
                  Start your 30-day free trial. No credit card required to explore live charts, indicators, and watchlists.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#089981] shrink-0 stroke-[2.5]" />
                  <span>Real-time quotes with zero latency</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#089981] shrink-0 stroke-[2.5]" />
                  <span>Custom watchlists synchronized across devices</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#089981] shrink-0 stroke-[2.5]" />
                  <span>Interactive candlestick charts & Pine Script indicators</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-[#089981] shrink-0 stroke-[2.5]" />
                  <span>$100,000 virtual paper trading account</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e222d] border border-gray-200 dark:border-gray-700 rounded-2xl text-[15px] text-gray-900 dark:text-white outline-none focus:border-[#2962ff]"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-[14px] font-bold text-white rounded-2xl bg-gradient-to-r from-[#2962ff] to-[#802cf6] hover:opacity-95 shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start 30-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
