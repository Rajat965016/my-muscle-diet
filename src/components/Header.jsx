import React from 'react';

export default function Header() {
  return (
    <header className="px-5 py-8">
      <div className="flex items-center space-x-2">
        <h1 className="text-[26px] font-black text-white tracking-wide uppercase">
          My Muscle Diet
        </h1>
        <span className="text-2xl">🔥</span>
      </div>
      <p className="text-sm text-app-green font-bold mt-1">
        130g protein &middot; every single day
      </p>
    </header>
  );
}
