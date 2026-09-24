import React from 'react';

export default function Sidebar({ activeView, onViewChange, onRegenerate, onLogout, userName = "Athlete" }) {
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "A";

  const navItems = [
    {
      id: 'meals',
      label: "Today's Plan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'calendar',
      label: "Weekly Calendar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'stats',
      label: "Nutrition Goals",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* DESKTOP VERTICAL PILL DOCK (Matching Image 1's Left Dock in Navy Blue) */}
      <aside className="hidden md:flex flex-col items-center justify-between w-18 xl:w-20 py-7 rounded-[32px] bg-gradient-to-b from-[#084c8d] via-[#06427b] to-[#032b50] shadow-xl shadow-[#084c8d]/20 shrink-0 sticky top-6 h-[calc(100vh-48px)] my-6 ml-6 select-none z-30">
        
        {/* Brand Logo Mark */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="3" fill="#38bdf8" />
            </svg>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#7bbde8] uppercase">
            MD
          </span>
        </div>

        {/* Center Nav Icons */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                title={item.label}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-white text-[#084c8d] shadow-lg shadow-black/20 scale-105 font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}

                {/* Tooltip on hover */}
                <span className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#0a2240] text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </span>

                {/* Subtle active glow pill on the left */}
                {isActive && (
                  <span className="absolute -left-2 w-1 h-5 bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]" />
                )}
              </button>
            );
          })}

          {/* Quick Regenerate Button */}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              title="Generate New Plan"
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 relative group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#0a2240] text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                New Plan
              </span>
            </button>
          )}

          {/* Log Out Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Log Out"
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white/70 hover:text-red-300 hover:bg-white/10 transition-all duration-200 relative group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#0a2240] text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Log Out
              </span>
            </button>
          )}
        </nav>

        {/* Bottom User Avatar with status dot */}
        <div className="relative group cursor-pointer" title={`Profile: ${userName}`}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#38bdf8] to-[#60a5fa] text-[#0a2240] font-black flex items-center justify-center text-sm shadow-md border-2 border-white/20">
            {userInitial}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#032b50] rounded-full" />
          <span className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#0a2240] text-white text-xs font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            {userName}
          </span>
        </div>

      </aside>

      {/* MOBILE FLOATING BOTTOM DOCK */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#084c8d]/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-6 border border-white/20 select-none">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`p-2 rounded-full transition-all ${
                isActive ? 'bg-white text-[#084c8d] shadow-md' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.icon}
            </button>
          );
        })}

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            title="Generate New Plan"
            className="p-2 text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-2 text-white/70 hover:text-red-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </nav>
    </>
  );
}
