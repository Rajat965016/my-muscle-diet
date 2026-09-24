import React, { useState, useEffect } from 'react';
import { DEFAULT_PROTEIN_TARGET } from '../constants';

const MOTIVATIONS = [
  "You're building real, lasting muscle discipline.",
  "Consistency is the ultimate nutritional cheat code.",
  "Trust the process. Keep eating quality whole foods.",
  "Every gram of protein fuels recovery today.",
  "Precision nutrition transforms your physique."
];

function useCountUp(end, duration = 600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const endVal = Number(end) || 0;
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endVal));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return count;
}

export default function DaySummary({ plan, dayType = "Veg", targetProtein = DEFAULT_PROTEIN_TARGET }) {
  const safeTarget = Number(targetProtein) || DEFAULT_PROTEIN_TARGET;

  // Safe computation of total protein - GUARANTEED NO NaN
  let safeTotal = Number(plan?.totalProtein) || Number(plan?.totalProteinLabel) || 0;
  if (!safeTotal && Array.isArray(plan?.meals)) {
    plan.meals.forEach(m => {
      if (Array.isArray(m.items)) {
        m.items.forEach(it => {
          safeTotal += Number(it.protein) || 0;
        });
      }
    });
  }
  if (!safeTotal) safeTotal = safeTarget;
  const percentage = Math.min(100, Math.round((safeTotal / safeTarget) * 100)) || 0;
  const currentTotal = useCountUp(safeTotal, 600);
  
  const [phrase, setPhrase] = useState(MOTIVATIONS[0]);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    setPhrase(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    setBarWidth(0);
    const timeout = setTimeout(() => {
      setBarWidth(percentage);
    }, 60);
    return () => clearTimeout(timeout);
  }, [plan, percentage]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden mb-6 select-none animate-fade-slide-up">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#084c8d]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
              dayType === 'Egg' || dayType === 'Veg + Eggs'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : dayType === 'Pure Veg' || dayType === 'Veg'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-100 text-[#084c8d] border border-blue-200'
            }`}>
              {dayType} Nutrition Plan
            </span>
            <span className="text-xs text-[#52667d] font-semibold">
              &bull; 5 Meals Scheduled
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#0a2240] tracking-tight leading-snug">
            {phrase}
          </h3>

          {plan?.note && (
            <p className="text-xs sm:text-sm text-[#52667d] font-medium mt-1">
              {plan.note}
            </p>
          )}
        </div>
        
        {/* Big Protein Number - FIX: Guaranteed valid number, never NaN */}
        <div className="text-left sm:text-right shrink-0 bg-[#f8fafc] sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-100 self-stretch sm:self-auto">
          <div className="text-4xl sm:text-5xl font-black text-[#084c8d] leading-none tracking-tight">
            {currentTotal}g
          </div>
          <div className="text-[#52667d] text-xs font-bold uppercase tracking-wider mt-1.5">
            / {safeTarget}g Target
          </div>
        </div>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="relative z-10">
        <div className="flex justify-between items-center text-xs font-bold mb-2">
          <span className="text-[#52667d] uppercase tracking-wider text-[11px]">Daily Macro Target Progress</span>
          <span className="text-[#084c8d] font-black">{percentage}% {percentage >= 100 && '✓ Target Met'}</span>
        </div>
        <div className="h-3 w-full bg-[#f1f5f9] rounded-full overflow-hidden border border-slate-200/80 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[#084c8d] to-[#38bdf8] rounded-full transition-all duration-[800ms] ease-out shadow-sm"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
