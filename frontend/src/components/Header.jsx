import React from 'react';

export default function Header({ onReset, targetProtein = 130 }) {
  return (
    <header className="px-5 py-8 flex items-start justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-[26px] font-black text-white tracking-wide uppercase">
            My Muscle Diet
          </h1>
          <span className="text-2xl">🔥</span>
        </div>
        <p className="text-sm text-app-green font-bold mt-1">
          {targetProtein}g protein &middot; every single day
        </p>
      </div>
      
      {onReset && (
        <button 
          onClick={onReset}
          className="text-xs font-bold text-app-muted border border-[#333] px-3 py-1.5 rounded-lg hover:text-white hover:border-app-green transition-colors"
        >
          Start Fresh
        </button>
      )}
    </header>
  );
}
