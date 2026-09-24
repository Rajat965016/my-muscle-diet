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

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyCalendarView({
  days = [],
  weekPlan = {},
  selectedDay,
  onSelectDay,
  todayId,
  targetProtein = DEFAULT_PROTEIN_TARGET,
  loggedMeals = {}
}) {
  const safeTarget = Number(targetProtein) || DEFAULT_PROTEIN_TARGET;
  const todayIndex = DAY_ORDER.indexOf(todayId);

  // Compute weekly totals
  let weeklyTotalProtein = 0;
  let weeklyTotalCalories = 0;
  let daysWithCalories = 0;

  days.forEach(d => {
    const dayPlan = weekPlan[d.id] || {};
    weeklyTotalProtein += (dayPlan.totalProtein || safeTarget);
    const dayCal = Number(dayPlan.totalCalories || d.totalCalories);
    if (!isNaN(dayCal) && dayCal > 0) {
      weeklyTotalCalories += dayCal;
      daysWithCalories += 1;
    }
  });

  return (
    <div className="space-y-6 animate-fade-slide-up">
      {/* Weekly Stats Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#084c8d]">
            Weekly Nutrition Matrix
          </span>
          <h2 className="text-2xl font-black text-[#0a2240] tracking-tight mt-0.5">
            7-Day Complete Diet Schedule
          </h2>
          <p className="text-xs sm:text-sm text-[#52667d] mt-1">
            Click any day to view complete recipes, macro breakdowns, or review past days.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-[#8094aa] uppercase tracking-wider block">Weekly Target</span>
            <span className="text-xl sm:text-2xl font-black text-[#084c8d]">{weeklyTotalProtein}g</span>
            <span className="text-xs text-[#52667d] block">total protein</span>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-[#8094aa] uppercase tracking-wider block">Avg Daily Energy</span>
            <span className="text-xl sm:text-2xl font-black text-[#0a2240]">
              {daysWithCalories > 0 ? Math.round(weeklyTotalCalories / daysWithCalories) : "—"}
            </span>
            <span className="text-xs text-[#52667d] block">kcal / day</span>
          </div>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {days.map((day, idx) => {
          const dayPlan = weekPlan[day.id] || {};
          const isSelected = selectedDay === day.id;
          const isToday = todayId === day.id;
          const dayIdx = DAY_ORDER.indexOf(day.id);
          const isPast = todayIndex > -1 && dayIdx < todayIndex;

          const dayProtein = dayPlan.totalProtein || day.totalProtein || safeTarget;
          const rawDayCal = Number(dayPlan.totalCalories || day.totalCalories);
          const dayCalories = (!isNaN(rawDayCal) && rawDayCal > 0) ? Math.round(rawDayCal) : null;
          const proteinPercent = Math.round((dayProtein / safeTarget) * 100);

          // Meals preview
          const meals = dayPlan.meals || [];

          return (
            <div
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-[#084c8d] shadow-lg shadow-[#084c8d]/10 ring-2 ring-[#084c8d]/20 -translate-y-1'
                  : isToday
                    ? 'border-[#38bdf8] shadow-md hover:border-[#084c8d] hover:shadow-lg'
                    : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Card Top: Day Name, Day Type Badge, Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#0a2240]">
                      {DAY_FULL_NAMES[day.id] || day.id}
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-full bg-[#084c8d] text-white text-[10px] font-black uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Day Type Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    day.type === 'Pure Veg' || day.type === 'Veg'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : day.type === 'Egg' || day.type === 'Veg + Eggs'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-[#084c8d] border border-blue-200'
                  }`}>
                    {day.type}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 mb-4">
                  {isPast ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Completed &bull; Read-only History
                    </span>
                  ) : isToday ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#084c8d]">
                      <span className="w-2 h-2 rounded-full bg-[#084c8d] animate-ping" />
                      Active Today &bull; {meals.length} Meals
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#8094aa]">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      Scheduled &bull; {meals.length} Meals
                    </span>
                  )}
                </div>

                {/* Macro Target Row */}
                <div className="bg-[#f8fafc] rounded-2xl p-3.5 mb-4 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#8094aa] uppercase block">Protein Target</span>
                    <span className="text-base font-black text-[#084c8d]">{dayProtein}g</span>
                    <span className="text-[11px] text-[#52667d] font-semibold ml-1.5">({proteinPercent}%)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#8094aa] uppercase block">Est. Calories</span>
                    {dayCalories !== null ? (
                      <>
                        <span className="text-base font-black text-[#0a2240]">{dayCalories}</span>
                        <span className="text-[11px] text-[#52667d] ml-1">kcal</span>
                      </>
                    ) : (
                      <span className="text-base font-medium text-[#8094aa]">—</span>
                    )}
                  </div>
                </div>

                {/* Meals preview list */}
                <div className="space-y-2 mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8094aa] block mb-1">
                    Meal Schedule Preview
                  </span>
                  {meals.slice(0, 4).map((meal, mIdx) => {
                    const firstItem = meal.items && meal.items[0] ? meal.items[0].name : "Healthy portion";
                    return (
                      <div key={mIdx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100/80 last:border-0">
                        <span className="font-bold text-[#1e3a58] w-24 truncate">{meal.name}</span>
                        <span className="text-[#52667d] truncate flex-1 px-2">{firstItem}</span>
                        <span className="font-bold text-[#084c8d] shrink-0">+{meal.protein || 20}g</span>
                      </div>
                    );
                  })}
                  {meals.length > 4 && (
                    <div className="text-[11px] text-[#8094aa] font-medium pt-1">
                      + Dinner & evening recovery meal
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: View Details CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-[#52667d] font-semibold">
                  {isPast ? "Review Day History" : isToday ? "Open Today's Plan" : "Inspect Day Schedule"}
                </span>
                <span className="text-xs font-bold text-[#084c8d] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>View</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
