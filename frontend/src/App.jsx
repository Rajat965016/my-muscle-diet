import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import DaySummary from './components/DaySummary';
import MealCard from './components/MealCard';
import BottomSummary from './components/BottomSummary';
import NightReminder from './components/NightReminder';
import Onboarding from './components/Onboarding';
import InstallBanner from './components/InstallBanner';
import { transformApiPlan } from './utils/planTransformer';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LOADING_MESSAGES = [
  "🌤️ Checking weather in your city...",
  "📚 Consulting nutrition experts...",
  "🛒 Finding foods near you...",
  "🧮 Calculating your protein targets...",
  "✅ Finalizing your 7-day plan..."
];

function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    
    // 15 seconds = 15000ms. We update every 100ms. So 150 ticks.
    // 100% / 150 ticks = 0.666% per tick
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(100, p + (100 / 150))); 
    }, 100);
    
    return () => { clearInterval(msgInterval); clearInterval(progInterval); };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-5 font-sans text-center">
      <div className="text-8xl mb-8 animate-pulse">💪</div>
      <h2 className="text-xl font-bold text-app-green mb-2 transition-opacity duration-300">
        Building Your Diet Plan
      </h2>
      <p className="text-white text-lg mt-4 h-8">
        {LOADING_MESSAGES[msgIdx]}
      </p>
      <div className="w-full max-w-xs h-2 bg-[#1f1f1f] rounded-full overflow-hidden mt-6">
        <div 
          className="h-full bg-app-green transition-all duration-100 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-500 text-sm mt-4">This takes about 10-15 seconds</p>
    </div>
  );
}

function App() {
  const [appState, setAppState] = useState('onboarding'); 
  const [planData, setPlanData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedDay, setSelectedDay] = useState('');
  const [todayId, setTodayId] = useState('');

  useEffect(() => {
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayStr = daysArr[todayIndex];
    setTodayId(todayStr);
    setSelectedDay(todayStr);

    const cachedPlan = localStorage.getItem('muscle_diet_plan');
    if (cachedPlan) {
      try {
        const parsedPlan = JSON.parse(cachedPlan);
        const transformed = transformApiPlan(parsedPlan);
        setPlanData(transformed);
        setAppState('app');
      } catch (e) {
        console.error("Error parsing cached plan", e);
        setAppState('onboarding');
      }
    } else {
      setAppState('onboarding');
    }
  }, []);

  const handleOnboardingSubmit = async (formData) => {
    setAppState('loading');
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_URL}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to connect to AI nutritionist');
      }
      
      const planJson = await res.json();
      
      localStorage.setItem('muscle_diet_plan', JSON.stringify(planJson));
      localStorage.setItem('muscle_diet_user', JSON.stringify(formData));
      
      const transformed = transformApiPlan(planJson);
      setPlanData(transformed);
      setAppState('app');
    } catch (err) {
      console.error("Error generating plan:", err);
      setErrorMsg(err.message);
      setAppState('onboarding');
    }
  };

  const handleRegenerate = () => {
    localStorage.removeItem('muscle_diet_plan');
    localStorage.removeItem('muscle_diet_user');
    setPlanData(null);
    setAppState('onboarding');
  };

  if (appState === 'loading') {
    return <LoadingScreen />;
  }

  if (appState === 'onboarding') {
    return (
      <div className="bg-app-bg min-h-screen">
        {errorMsg && (
          <div className="max-w-md mx-auto p-4 mt-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm font-semibold">
            🚨 Error: {errorMsg}
          </div>
        )}
        <Onboarding onSubmit={handleOnboardingSubmit} />
      </div>
    );
  }

  // APP STATE
  if (!planData || !selectedDay) return <div className="min-h-screen bg-app-bg" />;

  const { DAYS, WEEK_PLAN, TARGET_PROTEIN } = planData;
  const currentDayObj = DAYS.find(d => d.id === selectedDay) || DAYS[0];
  const plan = WEEK_PLAN[currentDayObj.id];

  if (!plan) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center text-white">
        Invalid plan data detected. <button onClick={handleRegenerate} className="ml-2 text-app-green underline">Start Fresh</button>
      </div>
    );
  }

  let dailyProtein = 0;
  if (plan.meals) {
    plan.meals.forEach(meal => {
      if (meal.items) {
        meal.items.forEach(item => {
          dailyProtein += (item.protein || 0);
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-app-bg pb-8 relative max-w-md mx-auto overflow-hidden flex flex-col font-sans">
      <Header onRegenerate={handleRegenerate} targetProtein={TARGET_PROTEIN} />
      
      <DaySelector 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay}
        todayId={todayId}
        days={DAYS}
      />

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <DaySummary key={selectedDay} plan={plan} dayType={currentDayObj.type} targetProtein={TARGET_PROTEIN} />
        
        <div className="pb-2">
          {plan.meals && plan.meals.map((meal, idx) => (
            <MealCard 
              key={`${selectedDay}-${idx}`} 
              meal={meal} 
              dayType={currentDayObj.type} 
              idx={idx} 
            />
          ))}
        </div>

        <BottomSummary key={`bottom-${selectedDay}`} total={`${Math.round(dailyProtein)}g`} targetProtein={TARGET_PROTEIN} />
        
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
      <InstallBanner />
    </div>
  );
}

export default App;
