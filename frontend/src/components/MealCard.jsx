import React from 'react';

export default function MealCard({ meal, dayType, idx, isLogged = false, onToggleLog }) {
  const mealTotalProtein = meal.protein || (Array.isArray(meal.items) ? meal.items.reduce((acc, item) => acc + (Number(item.protein) || 0), 0) : 0);
  const realCalories = (typeof meal.calories === 'number' && meal.calories > 0) ? meal.calories : null;

  return (
    <div 
      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 mb-5 relative group ${
        isLogged 
          ? 'border-emerald-300 shadow-sm shadow-emerald-500/5 bg-emerald-50/20' 
          : 'border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Top Header: Meal Name, Time Badge, Logged Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#084c8d]/10 text-[#084c8d] flex items-center justify-center font-black text-base shrink-0">
            {idx === 0 ? "🍳" : idx === 1 ? "🍎" : idx === 2 ? "🍛" : idx === 3 ? "⚡" : "🥗"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[#0a2240] text-lg sm:text-xl tracking-tight">
                {meal.name}
              </h3>
              {isLogged && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Logged ✓
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-[#52667d]">
              Scheduled for {meal.time}
            </span>
          </div>
        </div>

        {/* Quick Nutrition Badges */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {realCalories !== null ? (
            <span className="px-3 py-1 rounded-full bg-[#f1f5f9] text-[#0a2240] text-xs font-bold border border-slate-200/80">
              {realCalories} kcal
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#f1f5f9] text-[#64748b] text-xs font-medium border border-slate-200/80">
              — kcal
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-[#084c8d] text-white text-xs font-bold shadow-sm">
            {mealTotalProtein}g protein
          </span>
        </div>
      </div>
      
      {/* Food Items List */}
      <div className="space-y-2.5">
        {meal.items && meal.items.map((item, itemIdx) => (
          <div 
            key={itemIdx} 
            className="flex justify-between items-center py-2.5 px-3 rounded-2xl bg-[#f8fafc] border border-slate-100/90 hover:bg-white hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              {item.tag === 'ADD' ? (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-full px-2 py-0.5 border border-emerald-200 shrink-0">
                  ADD
                </span>
              ) : (
                <span className="bg-slate-200 text-slate-700 text-[9px] font-bold uppercase rounded-full px-2 py-0.5 shrink-0">
                  {item.tag || "CORE"}
                </span>
              )}
              <span className="text-sm text-[#1e3a58] font-medium truncate">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {item.calories && !isNaN(Number(item.calories)) && Number(item.calories) > 0 ? (
                <span className="text-[11px] font-semibold text-[#64748b]">
                  {Math.round(Number(item.calories))} kcal
                </span>
              ) : null}
              <span className="text-sm font-black text-[#084c8d]">
                +{item.protein}g
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Card Footer: Summary & Mark as Eaten Button */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[#52667d] font-semibold">
          {meal.items ? `${meal.items.length} food items` : "Prepared meal"}
        </span>

        {onToggleLog && (
          <button
            onClick={onToggleLog}
            className={`px-4 py-2 rounded-full font-bold transition-all duration-200 flex items-center gap-1.5 select-none ${
              isLogged
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#084c8d] hover:bg-[#063b6f] text-white shadow-sm shadow-[#084c8d]/25 active:scale-95'
            }`}
          >
            <span>{isLogged ? "✓ Completed" : "Mark as Eaten"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
