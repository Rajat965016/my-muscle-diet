import React from 'react';

export default function Header({ onRegenerate, targetProtein = 130 }) {
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
      
      {onRegenerate && (
        <button 
          onClick={onRegenerate}
          className="text-xs px-2 py-1 font-bold text-app-green border border-app-green rounded-lg hover:bg-app-green hover:text-black transition-colors"
        >
          ↺ New Plan
        </button>
      )}
    </header>
  );
}
