import React, { useState, useEffect } from 'react';
import { TARGET_PROTEIN } from '../data';

const MOTIVATIONS = [
  "You're building something real.",
  "Consistency is the only cheat code.",
  "Trust the process. Keep eating.",
  "Every gram counts today."
];

function useCountUp(end, duration = 600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

export default function DaySummary({ plan, dayType }) {
  const total = plan.totalProteinLabel;
  const percentage = Math.min(100, Math.round((total / TARGET_PROTEIN) * 100));
  const currentTotal = useCountUp(total, 800);
  
  const [phrase, setPhrase] = useState(MOTIVATIONS[0]);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Randomize phrase on mount or plan change
    setPhrase(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    
    // Animate progress bar from 0
    setBarWidth(0);
    const timeout = setTimeout(() => {
      setBarWidth(percentage);
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [plan, percentage]);

  const bgClass = dayType === 'Egg' ? 'bg-[#1f1800] border-[#3a2c00]' : 'bg-[#0d1f0d] border-[#163816]';
  const badgeClass = dayType === 'Egg' ? 'bg-app-amber text-black' : 'bg-app-green text-black';

  return (
    <div className={`mx-5 my-6 rounded-2xl p-6 min-h-[130px] border relative overflow-hidden shadow-lg transition-colors duration-300 ${bgClass}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 pr-4">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 ${badgeClass}`}>
            {dayType} Day
          </span>
          <p className="text-white font-bold text-lg leading-tight mb-2">
            {phrase}
          </p>
          <p className="text-app-muted text-xs font-medium">
            {plan.note}
          </p>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className="text-[56px] font-black text-app-green leading-none tracking-tighter">
            {currentTotal}
          </div>
          <div className="text-app-muted text-xs font-bold uppercase tracking-wider mt-1">
            / {TARGET_PROTEIN}g Goal
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{percentage}% {percentage >= 100 && '✓'}</span>
        </div>
        <div className="h-[10px] w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-app-green rounded-full transition-all duration-[800ms] ease-out shadow-[0_0_8px_#22c55e]"
            style={{ width: `${barWidth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
