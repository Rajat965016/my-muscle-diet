import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import DaySummary from './components/DaySummary';
import MealCard from './components/MealCard';
import BottomSummary from './components/BottomSummary';
import NightReminder from './components/NightReminder';
import { DAYS, getDayPlan } from './data';

function App() {
  const [selectedDay, setSelectedDay] = useState('');
  const [todayId, setTodayId] = useState('');

  useEffect(() => {
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayStr = daysArr[todayIndex];
    setTodayId(todayStr);
    setSelectedDay(todayStr);
  }, []);

  if (!selectedDay) return <div className="min-h-screen bg-app-bg" />; // loading

  const currentDayObj = DAYS.find(d => d.id === selectedDay);
  const rawPlan = getDayPlan(currentDayObj.id);
  
  // Dynamically calculate total protein since it's removed from data.js
  const totalProteinLabel = rawPlan.meals.reduce((total, meal) => {
    return total + meal.items.reduce((mealTotal, item) => mealTotal + item.protein, 0);
  }, 0);
  
  const plan = { ...rawPlan, totalProteinLabel };

  return (
    <div className="min-h-screen bg-app-bg pb-8 relative max-w-md mx-auto overflow-hidden flex flex-col font-sans">
      <Header />
      
      <DaySelector 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay}
        todayId={todayId}
      />

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {/* We key DaySummary to force re-mounting so animations replay on day change */}
        <DaySummary key={selectedDay} plan={plan} dayType={currentDayObj.type} />
        
        <div className="pb-2">
          {plan.meals.map((meal, idx) => (
            <MealCard 
              key={`${selectedDay}-${idx}`} 
              meal={meal} 
              dayType={currentDayObj.type} 
              idx={idx} 
            />
          ))}
        </div>

        <BottomSummary key={`bottom-${selectedDay}`} total={plan.totalProteinLabel} />
        
        <NightReminder note={plan.note} />
      </main>

      {selectedDay !== todayId && (
        <button 
          onClick={() => setSelectedDay(todayId)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg font-bold text-sm z-20 whitespace-nowrap animate-pulse-slow active:scale-95 transition-transform"
        >
          Back to Today
        </button>
      )}
    </div>
  );
}

export default App;
