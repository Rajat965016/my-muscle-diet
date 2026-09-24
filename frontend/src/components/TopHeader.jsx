import React from 'react';
import { DEFAULT_PROTEIN_TARGET } from '../constants';

export default function TopHeader({ 
  userName = "Athlete", 
  targetProtein = DEFAULT_PROTEIN_TARGET, 
  activeView = 'meals', 
  onViewChange, 
  onRegenerate,
  onLogout,
  selectedDay = "Mon"
}) {
  return (
    <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Greeting and subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0a2240] tracking-tight">
            Welcome back, {userName}!
          </h1>
          <span className="text-xl sm:text-2xl animate-pulse">💪</span>
        </div>
        <p className="text-xs sm:text-sm text-[#52667d] font-medium mt-1">
          Fuel your fitness goals today &bull; Target: <span className="text-[#084c8d] font-bold">{targetProtein}g daily protein</span>
        </p>
      </div>

      {/* View Switcher Pills & Action Button matching Image 1 */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <div className="bg-[#e9eff6] p-1 rounded-full flex items-center gap-1 border border-[#d6e2ef]">
          <button
            onClick={() => onViewChange('meals')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeView === 'meals'
                ? 'bg-[#084c8d] text-white shadow-md shadow-[#084c8d]/25'
                : 'text-[#475569] hover:text-[#0a2240] hover:bg-white/60'
            }`}
          >
            Today's Meals
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 select-none whitespace-nowrap ${
              activeView === 'calendar'
                ? 'bg-[#084c8d] text-white shadow-md shadow-[#084c8d]/25'
                : 'text-[#475569] hover:text-[#0a2240] hover:bg-white/60'
            }`}
          >
            Weekly Calendar
          </button>
        </div>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-[#084c8d] hover:text-white bg-white hover:bg-[#084c8d] border border-[#cbd5e1] hover:border-[#084c8d] shadow-sm transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
            title="Generate new weekly diet plan"
          >
            <span className="text-sm">↺</span>
            <span>New Plan</span>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 shadow-sm transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
            title="Log out of your account"
          >
            <span className="text-sm">⎋</span>
            <span>Log Out</span>
          </button>
        )}
      </div>
    </header>
  );
}
