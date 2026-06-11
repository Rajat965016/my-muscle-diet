import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DaySelector from './components/DaySelector';
import DaySummary from './components/DaySummary';
import MealCard from './components/MealCard';
import BottomSummary from './components/BottomSummary';
import NightReminder from './components/NightReminder';
import Onboarding from './components/Onboarding';
import { getPlanData } from './data';

const LOADING_MESSAGES = [
  "Analyzing your body stats...", 
  "Building your protein targets...",
  "Sourcing Indian superfoods...", 
  "Calculating meal timing...",
  "Finalizing your 7-day plan..."
];

function LoadingScreen({ customMessage }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    // 15 seconds = 15000ms. We update every 100ms. So 150 ticks.
    // 100% / 150 ticks = 0.666% per tick
    const progInterval = setInterval(() => {
      setProgress(p => Math.min(100, p + (100 / 150))); 
    }, 100);
    
    return () => { clearInterval(msgInterval); clearInterval(progInterval); };
  }, []);

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-5 font-sans text-center">
      <div className="text-7xl mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">⚡</div>
      <h2 className="text-xl font-bold text-white mb-2 transition-opacity duration-300">
        {customMessage || LOADING_MESSAGES[msgIdx]}
      </h2>
      <div className="w-full max-w-xs h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden mt-6">
        <div 
          className="h-full bg-app-green transition-all duration-100" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function App() {
  const [appState, setAppState] = useState('fetching'); 
  const [apiResponse, setApiResponse] = useState(null);
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedDay, setSelectedDay] = useState('');
  const [todayId, setTodayId] = useState('');

  useEffect(() => {
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayStr = daysArr[todayIndex];
    setTodayId(todayStr);
    setSelectedDay(todayStr);

    const cachedEmail = localStorage.getItem('muscle_diet_email');
    if (cachedEmail) {
      fetch(`http://127.0.0.1:8000/get-plan/${cachedEmail}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          if (data && data.plan) {
            setApiResponse(data.plan);
            setUserData(data.user_data || {});
            setAppState('app');
          } else {
            setAppState('onboarding');
          }
        })
        .catch(() => setAppState('onboarding'));
    } else {
      setAppState('onboarding');
    }
  }, []);

  const handleOnboardingSubmit = async (formData) => {
    setAppState('loading');
    setErrorMsg(null);
    try {
      // 1. Generate Plan
      const res = await fetch('http://127.0.0.1:8000/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to connect to AI nutritionist');
      }
      
      const planJson = await res.json();
      
      // 2. Save Plan to MongoDB
      const saveRes = await fetch('http://127.0.0.1:8000/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: formData.email,
          plan: planJson,
          user_data: formData
        })
      });

      if (!saveRes.ok) {
        console.warn("Plan generated but failed to persist to MongoDB.");
      }

      // 3. Cache email locally for auto-logins
      localStorage.setItem('muscle_diet_email', formData.email);
      
      setApiResponse(planJson);
      setUserData(formData);
      setAppState('app');
    } catch (err) {
      setErrorMsg(err.message);
      setAppState('onboarding');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('muscle_diet_email');
    setApiResponse(null);
    setUserData(null);
    setAppState('onboarding');
  };

  if (appState === 'fetching') {
    return <LoadingScreen customMessage="Fetching your saved plan..." />;
  }

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
  if (!selectedDay || !apiResponse) return <div className="min-h-screen bg-app-bg" />;

  const { DAYS, WEEK_PLAN, targetProtein } = getPlanData(apiResponse);
  const currentDayObj = DAYS.find(d => d.id === selectedDay) || DAYS[0];
  const plan = WEEK_PLAN[currentDayObj.id];

  if (!plan) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center text-white">
        Invalid plan data detected. <button onClick={handleReset} className="ml-2 text-app-green underline">Start Fresh</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-8 relative max-w-md mx-auto overflow-hidden flex flex-col font-sans">
      <Header onReset={handleReset} targetProtein={targetProtein} />
      
      <DaySelector 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay}
        todayId={todayId}
        days={DAYS}
      />

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <DaySummary key={selectedDay} plan={plan} dayType={currentDayObj.type} targetProtein={targetProtein} />
        
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

        <BottomSummary key={`bottom-${selectedDay}`} total={plan.totalProteinLabel} targetProtein={targetProtein} />
        
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
