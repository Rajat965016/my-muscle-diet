import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DaySelector from './components/DaySelector';
import DaySummary from './components/DaySummary';
import MealCard from './components/MealCard';
import RightSummaryPanel from './components/RightSummaryPanel';
import WeeklyCalendarView from './components/WeeklyCalendarView';
import WeekEndBanner from './components/WeekEndBanner';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import SetPasswordModal from './components/SetPasswordModal';
import InstallBanner from './components/InstallBanner';
import ConfirmModal from './components/ConfirmModal';
import { transformApiPlan } from './utils/planTransformer';
import { DEFAULT_PROTEIN_TARGET, STORAGE_KEYS } from './constants';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8055";

const LOADING_MESSAGES = [
  "🌤️ Checking local weather in your city...",
  "📚 Consulting sports nutrition research...",
  "🛒 Selecting fresh regional market ingredients...",
  "🧮 Balancing daily protein & calories...",
  "✅ Finalizing your personalized 7-day plan..."
];

function LoadingScreen({ onRetry, onCancel, error = null, isTimedOut = false }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (error || isTimedOut) return;

    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2800);

    const timerInterval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);

    return () => {
      clearInterval(msgInterval);
      clearInterval(timerInterval);
    };
  }, [error, isTimedOut]);

  const hasFailed = !!error || isTimedOut;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#085494] via-[#054d87] to-[#022849] flex flex-col items-center justify-center p-6 font-sans text-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#38bdf8]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#084c8d]/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 shadow-2xl">
        {hasFailed ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-5 text-2xl shadow-md">
              ⚠️
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
              {isTimedOut ? "Generation Timed Out" : "Generation Failed"}
            </h2>
            <p className="text-amber-200 text-xs sm:text-sm font-medium mb-6 px-2 leading-relaxed">
              {error || "Plan generation took longer than 60 seconds. The AI nutritionist service might be busy or unreachable."}
            </p>
            <div className="flex items-center gap-3 w-full">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                >
                  Edit Profile
                </button>
              )}
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-[#022849] bg-white hover:bg-sky-50 shadow-lg shadow-white/20 transition-all active:scale-95"
                >
                  Try Again
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mb-6 shadow-md">
              <div className="w-8 h-8 border-3 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
              Generating your plan... {elapsedSeconds}s
            </h2>
            <p className="text-[#93c5fd] text-xs sm:text-sm h-12 flex items-center justify-center font-medium px-2">
              {LOADING_MESSAGES[msgIdx]}
            </p>

            {/* Indeterminate pulsing progress bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden mt-6 border border-white/10 p-0.5 relative">
              <div className="h-full bg-gradient-to-r from-[#38bdf8] via-white to-[#38bdf8] rounded-full w-2/5 animate-indeterminate" />
            </div>
            <p className="text-white/60 text-xs mt-4 font-semibold">
              Tailoring macros to your body & city...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState(() => {
    try {
      const cachedPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (cachedPlan) return 'app';
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) return 'loading';
      return 'onboarding';
    } catch {
      return 'onboarding';
    }
  }); 
  const [planData, setPlanData] = useState(() => {
    try {
      const cachedPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
      return cachedPlan ? transformApiPlan(JSON.parse(cachedPlan)) : null;
    } catch {
      return null;
    }
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedDay, setSelectedDay] = useState('');
  const [todayId, setTodayId] = useState('');
  const [activeView, setActiveView] = useState('meals'); // 'meals' or 'calendar'

  // Loading & retry state for generation
  const [lastSubmittedFormData, setLastSubmittedFormData] = useState(null);
  const [loadingError, setLoadingError] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // New Plan Confirmation Modal state
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  // Legacy user transition modal state
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);

  // Backup plan existence indicator
  const [hasBackupPlan, setHasBackupPlan] = useState(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEYS.BACKUP_PLAN);
    } catch {
      return false;
    }
  });

  // User profile data from storage with safe parsing
  const [userData, setUserData] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.USER);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error("Corrupted localStorage user data:", e);
      try { localStorage.removeItem(STORAGE_KEYS.USER); } catch {}
      return null;
    }
  });

  // Track logged meals in localStorage with safe parsing
  const [loggedMeals, setLoggedMeals] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.LOGGED_MEALS);
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      console.error("Corrupted localStorage logged meals:", e);
      try { localStorage.removeItem(STORAGE_KEYS.LOGGED_MEALS); } catch {}
      return {};
    }
  });

  useEffect(() => {
    const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayStr = daysArr[todayIndex];
    setTodayId(todayStr);
    setSelectedDay(todayStr);

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const cachedPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
    const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);

    // 1. Cached plan exists locally
    if (cachedPlan) {
      try {
        const parsedPlan = JSON.parse(cachedPlan);
        const transformed = transformApiPlan(parsedPlan);
        setPlanData(transformed);
        setAppState('app');

        // Check if legacy user without password/token -> prompt once to secure account
        if (!token && cachedUser) {
          try {
            const userObj = JSON.parse(cachedUser);
            if (userObj.email && !sessionStorage.getItem('dismissed_set_password_prompt')) {
              setShowSetPasswordModal(true);
            }
          } catch {}
        }
        return;
      } catch (e) {
        console.error("Corrupted localStorage plan data:", e);
        try { localStorage.removeItem(STORAGE_KEYS.PLAN); } catch {}
        setErrorMsg("We couldn't load your saved plan. Please set up your profile again.");
      }
    }

    // 2. Token exists but no plan in localStorage -> fetch latest plan from backend /me
    if (token) {
      fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.plan) {
          const transformed = transformApiPlan(data.plan);
          setPlanData(transformed);
          localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(data.plan));
          if (data.user) {
            const userProf = data.user.profile && Object.keys(data.user.profile).length > 0 ? data.user.profile : data.user;
            setUserData(userProf);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProf));
          }
          setAppState('app');
        } else if (data && data.user) {
          const userProf = data.user.profile && Object.keys(data.user.profile).length > 0 ? data.user.profile : data.user;
          setUserData(userProf);
          setAppState('onboarding');
        } else {
          // Token expired or invalid
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          setAppState('onboarding');
        }
      })
      .catch(() => {
        setAppState('onboarding');
      });
      return;
    }

    // 3. No plan and no token -> default to Create Diet Plan screen (Onboarding)
    setAppState('onboarding');
  }, []);

  // Single source of protein target from user's actual profile answer
  const effectiveProteinTarget = Number(userData?.protein_target) || Number(planData?.TARGET_PROTEIN) || DEFAULT_PROTEIN_TARGET;

  const handleLoginSuccess = (data) => {
    const { token, user, plan } = data;
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }
    if (user) {
      const userProfile = user.profile && Object.keys(user.profile).length > 0 ? user.profile : user;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
      setUserData(userProfile);
    }
    if (plan && plan.days) {
      try {
        localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
        const transformed = transformApiPlan(plan);
        setPlanData(transformed);
        setAppState('app');
        return;
      } catch (e) {
        console.error("Error transforming user plan on login:", e);
      }
    }
    // If user has no plan yet in DB, take them to onboarding
    setAppState('onboarding');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.PLAN);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_MEALS);
    setPlanData(null);
    setLoggedMeals({});
    setAppState('login');
  };

  const handleOnboardingSubmit = async (formData) => {
    setLastSubmittedFormData(formData);
    setAppState('loading');
    setLoadingError(null);
    setIsTimedOut(false);
    setErrorMsg(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      setIsTimedOut(true);
      controller.abort();
    }, 60000);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/generate-plan`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to connect to AI nutritionist');
      }

      const planJson = await res.json();

      // Store session token if returned
      if (planJson.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, planJson.token);
      }

      // Store plan and user without plain-text password
      const { password, confirm_password, ...safeUserData } = formData;
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(planJson));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUserData));
      setUserData(safeUserData);

      const transformed = transformApiPlan(planJson);
      setPlanData(transformed);
      setAppState('app');
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Error generating plan:", err);
      if (err.name === 'AbortError') {
        setIsTimedOut(true);
        setLoadingError("Plan generation timed out after 60 seconds. The AI service is currently busy.");
      } else {
        setLoadingError(err.message || "Failed to generate diet plan");
      }
    }
  };

  const handleRequestNewPlan = () => {
    setShowNewPlanModal(true);
  };

  const handleConfirmNewPlan = () => {
    try {
      const currentPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
      const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
      const currentLogs = localStorage.getItem(STORAGE_KEYS.LOGGED_MEALS);

      // Save backups before clearing active plan
      if (currentPlan) {
        localStorage.setItem(STORAGE_KEYS.BACKUP_PLAN, currentPlan);
      }
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.LAST_PROFILE, currentUser);
      } else if (userData) {
        localStorage.setItem(STORAGE_KEYS.LAST_PROFILE, JSON.stringify(userData));
      }
      if (currentLogs) {
        localStorage.setItem(STORAGE_KEYS.BACKUP_LOGGED_MEALS, currentLogs);
      }

      setHasBackupPlan(true);

      // Clear active plan & active logs so user starts a fresh plan
      localStorage.removeItem(STORAGE_KEYS.PLAN);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_MEALS);

      setPlanData(null);
      setLoggedMeals({});
      setShowNewPlanModal(false);
      setAppState('onboarding');
    } catch (e) {
      console.error("Error creating backup before new plan:", e);
      setShowNewPlanModal(false);
      setAppState('onboarding');
    }
  };

  const handleRestorePreviousPlan = () => {
    try {
      const backupPlan = localStorage.getItem(STORAGE_KEYS.BACKUP_PLAN);
      const backupProfile = localStorage.getItem(STORAGE_KEYS.LAST_PROFILE);
      const backupLogs = localStorage.getItem(STORAGE_KEYS.BACKUP_LOGGED_MEALS);

      if (!backupPlan) {
        setErrorMsg("No previous plan backup was found.");
        return;
      }

      const parsedPlan = JSON.parse(backupPlan);
      const transformed = transformApiPlan(parsedPlan);

      localStorage.setItem(STORAGE_KEYS.PLAN, backupPlan);
      if (backupProfile) {
        localStorage.setItem(STORAGE_KEYS.USER, backupProfile);
        setUserData(JSON.parse(backupProfile));
      }
      if (backupLogs) {
        localStorage.setItem(STORAGE_KEYS.LOGGED_MEALS, backupLogs);
        setLoggedMeals(JSON.parse(backupLogs));
      }

      setPlanData(transformed);
      setErrorMsg(null);
      setAppState('app');
    } catch (err) {
      console.error("Error restoring previous plan:", err);
      setErrorMsg("We couldn't restore your previous plan. Please set up your profile again.");
    }
  };

  const handleGenerateNextWeek = () => {
    sessionStorage.removeItem('dismissed_weekend_banner');
    const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        handleOnboardingSubmit(parsed);
        return;
      } catch (e) {
        console.error("Error reading cached user", e);
      }
    }
    handleRequestNewPlan();
  };

  const handleToggleMealLogged = (mealKey) => {
    setLoggedMeals(prev => {
      const updated = { ...prev, [mealKey]: !prev[mealKey] };
      localStorage.setItem(STORAGE_KEYS.LOGGED_MEALS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogAllMeals = () => {
    if (!planData || !selectedDay) return;
    const currentPlan = planData.WEEK_PLAN[selectedDay];
    if (!currentPlan || !currentPlan.meals) return;

    const allKeys = currentPlan.meals.map((m, idx) => `${selectedDay}-${m.name || idx}`);
    const allLogged = allKeys.every(k => loggedMeals[k]);

    setLoggedMeals(prev => {
      const updated = { ...prev };
      allKeys.forEach(k => {
        updated[k] = !allLogged;
      });
      localStorage.setItem(STORAGE_KEYS.LOGGED_MEALS, JSON.stringify(updated));
      return updated;
    });
  };

  if (appState === 'loading') {
    return (
      <LoadingScreen 
        onRetry={() => lastSubmittedFormData && handleOnboardingSubmit(lastSubmittedFormData)}
        onCancel={() => {
          setAppState('onboarding');
          setLoadingError(null);
          setIsTimedOut(false);
        }}
        error={loadingError}
        isTimedOut={isTimedOut}
      />
    );
  }

  if (appState === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateToOnboarding={() => setAppState('onboarding')}
      />
    );
  }

  if (appState === 'onboarding') {
    return (
      <div className="relative min-h-screen">
        <Onboarding 
          onSubmit={handleOnboardingSubmit}
          onRestorePreviousPlan={handleRestorePreviousPlan}
          onNavigateToLogin={() => setAppState('login')}
          hasBackupPlan={hasBackupPlan}
          initialError={errorMsg}
          onClearError={() => setErrorMsg(null)}
        />
      </div>
    );
  }

  // APP STATE
  if (!planData || !selectedDay) {
    return <div className="min-h-screen bg-[#f4f7fb]" />;
  }

  const { DAYS, WEEK_PLAN, meta } = planData;
  const currentDayObj = DAYS.find(d => d.id === selectedDay) || DAYS[0];
  const plan = WEEK_PLAN[currentDayObj.id] || WEEK_PLAN[DAYS[0].id];

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md shadow-xl">
          <h2 className="text-xl font-bold text-[#0a2240] mb-2">Plan Setup Needed</h2>
          <p className="text-sm text-slate-500 mb-6">We couldn't load your weekly schedule. Let's regenerate it fresh.</p>
          <button 
            onClick={handleRequestNewPlan} 
            className="w-full py-3 rounded-full bg-[#084c8d] text-white font-bold text-sm shadow-md"
          >
            Start Fresh
          </button>
        </div>
      </div>
    );
  }

  // Week-end condition: Sunday selected or today is Sunday
  const isWeekEnd = selectedDay === 'Sun' || todayId === 'Sun';

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans flex flex-col md:flex-row antialiased selection:bg-[#084c8d] selection:text-white">
      
      {/* 1. LEFT SLIM PILL SIDEBAR */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onRegenerate={handleRequestNewPlan}
        onLogout={handleLogout}
        userName={userData?.name || meta?.name || "Athlete"}
      />

      {/* 2. CENTER MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto md:mx-0 overflow-y-auto hide-scrollbar pb-24 md:pb-8">
        
        {/* Top Header with greeting, subtitle, view switcher tabs, new plan button, and log out */}
        <TopHeader
          userName={userData?.name || meta?.name || "Athlete"}
          targetProtein={effectiveProteinTarget}
          activeView={activeView}
          onViewChange={setActiveView}
          onRegenerate={handleRequestNewPlan}
          onLogout={handleLogout}
          selectedDay={selectedDay}
        />

        {/* Week-End Notification (shown when week complete / Sunday) */}
        {isWeekEnd && (
          <WeekEndBanner
            onGenerateNextWeek={handleGenerateNextWeek}
            onViewCalendar={() => setActiveView('calendar')}
          />
        )}

        {/* VIEW 1: TODAY'S MEALS VIEW */}
        {activeView === 'meals' && (
          <div>
            {/* Day Selector Pills */}
            <DaySelector 
              selectedDay={selectedDay} 
              onSelectDay={setSelectedDay}
              todayId={todayId}
              days={DAYS}
            />

            {/* Day Nutrition Hero Card */}
            <DaySummary 
              key={`summary-${selectedDay}`} 
              plan={plan} 
              dayType={currentDayObj.type} 
              targetProtein={effectiveProteinTarget} 
            />
            
            {/* Section Heading */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#0a2240] tracking-tight">
                  {selectedDay === todayId ? "Today's Meal Schedule" : `${currentDayObj.label || selectedDay}'s Meal Schedule`}
                </h3>
                <p className="text-xs text-[#52667d] font-medium">
                  5 balanced meals customized for your target
                </p>
              </div>

              <span className="text-xs font-bold text-[#084c8d] bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
                {plan.meals ? plan.meals.length : 5} Meals
              </span>
            </div>

            {/* Meal Cards */}
            <div className="space-y-4">
              {plan.meals && plan.meals.map((meal, idx) => {
                const mealKey = `${selectedDay}-${meal.name || idx}`;
                return (
                  <MealCard 
                    key={`${selectedDay}-${idx}`} 
                    meal={meal} 
                    dayType={currentDayObj.type} 
                    idx={idx} 
                    isLogged={!!loggedMeals[mealKey]}
                    onToggleLog={() => handleToggleMealLogged(mealKey)}
                  />
                );
              })}
            </div>

            {/* Mobile / Tablet summary panel (when right side panel is stacked or screen < lg) */}
            <div className="lg:hidden mt-8">
              <RightSummaryPanel
                plan={plan}
                selectedDay={selectedDay}
                targetProtein={effectiveProteinTarget}
                loggedMealMap={loggedMeals}
                onToggleMealLogged={handleToggleMealLogged}
                onLogAllMeals={handleLogAllMeals}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: WEEKLY CALENDAR VIEW */}
        {activeView === 'calendar' && (
          <WeeklyCalendarView
            days={DAYS}
            weekPlan={WEEK_PLAN}
            selectedDay={selectedDay}
            onSelectDay={(dayId) => {
              setSelectedDay(dayId);
              setActiveView('meals');
            }}
            todayId={todayId}
            targetProtein={effectiveProteinTarget}
            loggedMeals={loggedMeals}
          />
        )}

      </div>

      {/* 3. RIGHT SIDE PANEL: "Your meal plan" summary panel */}
      <div className="hidden lg:block p-6 pl-0 shrink-0">
        <RightSummaryPanel
          plan={plan}
          selectedDay={selectedDay}
          targetProtein={effectiveProteinTarget}
          loggedMealMap={loggedMeals}
          onToggleMealLogged={handleToggleMealLogged}
          onLogAllMeals={handleLogAllMeals}
        />
      </div>

      {/* Floating Back to Today Pill (when viewing other days) */}
      {selectedDay !== todayId && activeView === 'meals' && (
        <button 
          onClick={() => setSelectedDay(todayId)}
          className="fixed bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-[#084c8d] text-white px-6 py-3 rounded-full shadow-xl font-bold text-xs sm:text-sm z-30 whitespace-nowrap active:scale-95 transition-all flex items-center gap-2 border border-white/20"
        >
          <span>&larr;</span>
          <span>Back to Today ({todayId})</span>
        </button>
      )}

      {/* Confirmation Modal for New Plan */}
      <ConfirmModal
        isOpen={showNewPlanModal}
        title="Start a New Plan?"
        message="Are you sure you want to start a new plan? Your current week's progress will be replaced."
        confirmLabel="Yes, Start New Plan"
        cancelLabel="Cancel"
        onConfirm={handleConfirmNewPlan}
        onCancel={() => setShowNewPlanModal(false)}
      />

      {/* Existing Users Transition Modal to Set Password */}
      <SetPasswordModal
        isOpen={showSetPasswordModal}
        email={userData?.email || ""}
        onSuccess={(token) => {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          setShowSetPasswordModal(false);
        }}
        onDismiss={() => {
          sessionStorage.setItem('dismissed_set_password_prompt', 'true');
          setShowSetPasswordModal(false);
        }}
      />

      <InstallBanner />
    </div>
  );
}
