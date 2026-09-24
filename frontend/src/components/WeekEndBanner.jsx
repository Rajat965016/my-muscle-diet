import React, { useState, useEffect } from 'react';

export default function WeekEndBanner({ onGenerateNextWeek, onViewCalendar }) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('dismissed_weekend_banner');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('dismissed_weekend_banner', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#084c8d] via-[#06427b] to-[#022849] p-5 sm:p-6 text-white shadow-xl shadow-[#084c8d]/20 mb-6 border border-white/15 animate-fade-slide-up">
      {/* Ambient background decoration */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#38bdf8]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#084c8d]/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            🎉
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#0a2240] text-[10px] font-black uppercase tracking-wider">
                Week Complete
              </span>
              <span className="text-white/60 text-xs font-semibold">
                Sunday Milestone
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Your 7-Day Diet Week is Complete!
            </h3>
            <p className="text-xs sm:text-sm text-[#93c5fd] font-medium mt-0.5 max-w-xl leading-relaxed">
              Incredible discipline! Ready to generate your customized plan for next week with updated seasonal foods and fresh recipes?
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          {onViewCalendar && (
            <button
              onClick={onViewCalendar}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-full text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-center whitespace-nowrap"
            >
              View Week Summary
            </button>
          )}

          <button
            onClick={onGenerateNextWeek}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-[#084c8d] bg-white hover:bg-[#f0f7fc] shadow-lg shadow-black/25 active:scale-95 transition-all text-center whitespace-nowrap"
          >
            Generate Next Week's Plan →
          </button>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            title="Dismiss for now"
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
