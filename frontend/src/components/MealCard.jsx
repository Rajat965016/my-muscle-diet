import React from 'react';

export default function MealCard({ meal, dayType, idx }) {
  const mealTotalProtein = meal.items.reduce((acc, item) => acc + item.protein, 0);
  const estimatedCalories = Math.round(mealTotalProtein * 9.5); // Mock calories

  const borderClass = dayType === 'Egg' ? 'border-l-app-amber' : 'border-l-app-green';

  return (
    <div 
      className={`bg-app-card rounded-2xl p-5 border border-app-border mb-4 mx-5 border-l-4 opacity-0 animate-fade-slide-up ${borderClass}`}
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-app-border">
        <h3 className="font-semibold text-white text-lg">{meal.name}</h3>
        <span className="text-xs font-semibold text-app-muted bg-black/20 px-2.5 py-1 rounded-md">{meal.time}</span>
      </div>
      
      <div className="space-y-0">
        {meal.items.map((item, itemIdx) => (
          <div key={itemIdx} className={`flex justify-between items-center py-3 ${itemIdx !== meal.items.length - 1 ? 'border-b border-app-border' : ''}`}>
            <div className="flex items-center space-x-3">
              {item.tag === 'ADD' ? (
                <span className="bg-app-green text-black text-[9px] font-bold uppercase rounded-full px-2 py-0.5 shadow-[0_0_6px_rgba(34,197,94,0.4)]">
                  ADD
                </span>
              ) : (
                <span className="bg-[#2a2a2a] text-[#6b7280] text-[9px] font-bold uppercase rounded-full px-2 py-0.5">
                  {item.tag}
                </span>
              )}
              <span className="text-sm text-white font-medium">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-app-green flex-shrink-0 ml-2">{item.protein}g</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 pt-4 border-t border-app-border flex justify-between items-center text-sm">
        <span className="text-app-muted font-medium">Meal total</span>
        <div className="text-right space-x-3">
          <span className="text-app-muted text-xs">{estimatedCalories} kcal</span>
          <span className="font-bold text-app-green">{mealTotalProtein}g</span>
        </div>
      </div>
    </div>
  );
}
