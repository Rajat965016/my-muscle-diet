import React, { useEffect, useRef } from 'react';

const DAY_FULL_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
};

export default function DaySelector({ selectedDay, onSelectDay, todayId, days = [] }) {
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
    <div className="py-2.5 mb-6 sticky top-0 z-20 bg-[#f4f7fb]/90 backdrop-blur-md">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar gap-2.5 sm:gap-3 pb-1"
      >
        {days.map(day => {
          const isActive = day.id === selectedDay;
          const isToday = day.id === todayId;
          
          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 border whitespace-nowrap select-none active:scale-95 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#084c8d] text-white border-[#084c8d] shadow-md shadow-[#084c8d]/25 scale-[1.02] active-day'
                  : 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#9cb4cd] hover:text-[#0a2240] shadow-sm'
              } ${
                !isActive && isToday ? 'ring-2 ring-[#084c8d]/30 font-extrabold' : ''
              }`}
            >
              <span>{day.id}</span>
              {isToday && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#38bdf8]' : 'bg-[#084c8d]'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
