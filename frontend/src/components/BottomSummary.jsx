import React, { useEffect, useState } from 'react';

export default function BottomSummary({ total, targetProtein = 130 }) {
  const percentage = Math.min(100, Math.round((total / targetProtein) * 100));
  const remaining = Math.max(0, targetProtein - total);
  const isTargetMet = total >= targetProtein;
  
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  
  // Animation for the SVG stroke
  const [strokeOffset, setStrokeOffset] = useState(circumference);
  
  useEffect(() => {
    setStrokeOffset(circumference);
    const timeout = setTimeout(() => {
      const offset = circumference - (percentage / 100) * circumference;
      setStrokeOffset(offset);
    }, 100);
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  return (
    <div className="mx-5 mb-6 rounded-2xl p-6 border border-app-green shadow-[0_0_15px_rgba(34,197,94,0.15)] bg-gradient-to-b from-[#0d1f0d] to-[#0f0f0f]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-black text-app-muted tracking-widest uppercase mb-1">Daily Target</h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black text-app-green">{total}</span>
            <span className="text-lg font-bold text-app-green">g</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5">
            {isTargetMet ? (
              <>
                <svg className="w-4 h-4 text-app-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-bold text-app-green">Target crushed!</span>
              </>
            ) : (
              <span className="text-sm font-medium text-app-muted">{remaining}g more to go</span>
            )}
          </div>
        </div>
        
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#22c55e"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-white font-black text-sm">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
