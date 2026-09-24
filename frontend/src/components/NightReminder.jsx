import React from 'react';

export default function NightReminder({ note }) {
  return (
    <div className="mx-5 mb-8 bg-[#1f1800] border-l-4 border-l-app-amber rounded-xl p-5 flex items-start space-x-4 shadow-lg">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-6 h-6 text-app-amber" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-app-amber mb-1 tracking-wide">Tonight's prep</h4>
        <p className="text-sm text-[#fef9c3] font-medium leading-relaxed">{note}</p>
      </div>
    </div>
  );
}
