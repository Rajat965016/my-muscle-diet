import React from 'react';
import { DEFAULT_PROTEIN_TARGET } from '../constants';

const DAY_FULL_NAMES = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
};

export default function RightSummaryPanel({
  plan,
  selectedDay = "Mon",
  targetProtein = DEFAULT_PROTEIN_TARGET,
  loggedMealMap = {},
  onToggleMealLogged,
  onLogAllMeals
}) {
  const meals = plan?.meals || [];
  const safeTarget = Number(targetProtein) || DEFAULT_PROTEIN_TARGET;
  
  // Safe calculation of planned protein
  const plannedProtein = Number(plan?.totalProtein) || Number(plan?.totalProteinLabel) || safeTarget;

  // Calculate actual logged protein from checked meals
  let loggedProtein = 0;
  let loggedCount = 0;

  meals.forEach((meal, idx) => {
    const mealKey = `${selectedDay}-${meal.name || idx}`;
    const isLogged = !!loggedMealMap[mealKey];
    if (isLogged) {
      loggedCount += 1;
      let mealProt = Number(meal.protein) || 0;
      if (!mealProt && Array.isArray(meal.items)) {
        mealProt = meal.items.reduce((acc, it) => acc + (Number(it.protein) || 0), 0);
      }
      loggedProtein += mealProt;
    }
  });

  // Calculate percentage safely without any NaN
  const displayProtein = loggedCount > 0 ? Math.round(loggedProtein) : plannedProtein;
  const percentage = Math.min(150, Math.round((displayProtein / safeTarget) * 100)) || 0;
  const remaining = Math.max(0, safeTarget - displayProtein);
  const isCrushed = displayProtein >= safeTarget;

  // SVG circular gauge
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (Math.min(100, percentage) / 100) * circumference;

  const dayFullName = DAY_FULL_NAMES[selectedDay] || selectedDay;

  return (
    <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6 select-none animate-fade-slide-up">
      {/* Main White Card Panel matching Image 1's "Your meal plan" panel */}
      <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        
        {/* Top Header: Title + Date Dropdown / Pill */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-[#0a2240] tracking-tight">
              Your Meal Plan
            </h2>
            <p className="text-xs text-[#52667d] font-medium mt-0.5">
              Daily macro breakdown & tracking
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#f1f5f9] text-[#084c8d] text-xs font-bold border border-[#dbe6f2] flex items-center gap-1.5">
            <span>📅</span>
            <span>{dayFullName}</span>
          </div>
        </div>

        {/* Protein Progress Circular Card (BUG FIX: NO MORE NaN!) */}
        <div className="bg-gradient-to-tr from-[#084c8d] to-[#0a3a65] rounded-3xl p-5 text-white mb-6 shadow-md shadow-[#084c8d]/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#7bbde8] uppercase block mb-1">
                Daily Protein Progress
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {displayProtein}
                </span>
                <span className="text-lg font-bold text-white/80">g</span>
                <span className="text-xs font-semibold text-white/60 ml-1">/ {safeTarget}g</span>
              </div>

              <p className="text-xs text-white/80 font-medium mt-2">
                {isCrushed ? (
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <span>✓</span> Goal crushed! Excellent discipline.
                  </span>
                ) : (
                  <span>{remaining}g more needed to hit target</span>
                )}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
              <svg className="w-22 h-22 transform -rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  stroke={isCrushed ? "#34d399" : "#38bdf8"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-white leading-none">
                  {percentage}%
                </span>
                <span className="text-[9px] font-bold text-white/70 uppercase">
                  Target
                </span>
              </div>
            </div>
          </div>

          {/* Quick status bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
            <span>{loggedCount} of {meals.length} meals logged</span>
            <button
              onClick={onLogAllMeals}
              className="text-white hover:text-white font-bold underline text-[11px]"
            >
              {loggedCount === meals.length ? "Reset Log" : "Log All Meals"}
            </button>
          </div>
        </div>

        {/* Breakdown List of Meals with Status Tags matching Image 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-[#0a2240] uppercase">
              Today's Schedule
            </span>
            <span className="text-[11px] text-[#52667d] font-semibold">
              Click meal to log/unlog
            </span>
          </div>

          <div className="space-y-3">
            {meals.map((meal, idx) => {
              const mealKey = `${selectedDay}-${meal.name || idx}`;
              const isLogged = !!loggedMealMap[mealKey];
              const mealProtein = Number(meal.protein) || (meal.items ? meal.items.reduce((s, it) => s + (Number(it.protein) || 0), 0) : 20);
              const firstItemName = meal.items && meal.items[0] ? meal.items[0].name : "Healthy portion";

              return (
                <div
                  key={idx}
                  onClick={() => onToggleMealLogged(mealKey)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isLogged
                      ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
                      : 'bg-[#f8fafc] border-slate-200/80 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Checkbox circle */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isLogged 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                        : 'border-slate-300 bg-white text-transparent hover:border-[#084c8d]'
                    }`}>
                      <span className="text-xs font-bold leading-none">✓</span>
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0a2240] truncate">
                          {meal.name}
                        </span>
                        <span className="text-[10px] text-[#52667d] font-medium">
                          &bull; {meal.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#52667d] truncate font-medium mt-0.5">
                        {firstItemName}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge styled like Image 1 ("Purchased", "Being ordered", "Haven't ordered yet") */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-[#084c8d]">
                      {mealProtein}g
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isLogged
                        ? 'bg-emerald-100 text-emerald-800'
                        : idx === 0 || idx === 1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isLogged ? "Logged" : idx === 0 ? "Up Next" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tonight's Prep Reminder Card */}
        {plan?.note && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-[#f0f7fc] border border-[#d6e8f7] rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl shrink-0">🌙</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#084c8d] block">
                  Tonight's Prep Reminder
                </span>
                <p className="text-xs text-[#294c6f] font-semibold mt-0.5 leading-snug">
                  {plan.note}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
