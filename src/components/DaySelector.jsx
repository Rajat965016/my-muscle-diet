import React, { useEffect, useRef } from 'react';
import { DAYS } from '../data';

export default function DaySelector({ selectedDay, onSelectDay, todayId }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto scroll to active day
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('.active-day');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDay]);

  return (
    <div className="py-2 sticky top-0 z-10 bg-app-bg/95 backdrop-blur-md">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar px-5 space-x-3 pb-2"
      >
        {DAYS.map(day => {
          const isActive = day.id === selectedDay;
          const isToday = day.id === todayId;
          
          let colorClasses = "";
          
          if (isActive) {
            colorClasses = day.type === 'Egg' 
              ? "bg-app-amber text-black border-app-amber active-day"
              : "bg-[#22c55e] text-black border-[#22c55e] active-day";
          } else {
            colorClasses = "bg-[#1f1f1f] text-gray-400 border-[#333333]";
          }

          // Today (if not active): subtle white ring outline
          if (!isActive && isToday) {
            colorClasses += " ring-1 ring-white/30 ring-offset-2 ring-offset-app-bg";
          }

          const baseClasses = "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border whitespace-nowrap select-none active:scale-90 active:animate-bounce-scale cursor-pointer";

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`${baseClasses} ${colorClasses}`}
            >
              {day.id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
