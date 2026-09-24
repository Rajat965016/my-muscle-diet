import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8055";

export default function Login({ onLoginSuccess, onNavigateToOnboarding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      // Successful login
      onLoginSuccess(data);
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#085494] via-[#054d87] to-[#022849] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden select-none">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#38bdf8]/15 rounded-full blur-[110px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#084c8d]/30 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white rounded-[32px] p-7 sm:p-10 border border-slate-100 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#084c8d] flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="3" fill="#38bdf8" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.16em] text-[#0a2240] uppercase leading-none">
              MUSCLEDIET
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#084c8d] uppercase mt-1">
              Precision Nutrition Engine
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a2240] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-[#52667d] font-normal mt-1">
            Log in to view your weekly meal plan & nutrition targets
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-600 hover:text-red-800 text-xs font-bold px-1.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1e3a58] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. athlete@example.com"
              autoComplete="email"
              required
              className="w-full bg-[#f8fafc] border border-[#d0dbe7] hover:border-[#9cb4cd] focus:border-[#084c8d] focus:ring-2 focus:ring-[#084c8d]/20 rounded-full px-5 py-3 text-[#0a2240] text-sm font-medium placeholder-[#94a3b8] focus:outline-none focus:bg-white transition-all min-h-[46px] shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1e3a58] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="text-[11px] font-semibold text-[#084c8d] hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full bg-[#f8fafc] border border-[#d0dbe7] hover:border-[#9cb4cd] focus:border-[#084c8d] focus:ring-2 focus:ring-[#084c8d]/20 rounded-full px-5 py-3 text-[#0a2240] text-sm font-medium placeholder-[#94a3b8] focus:outline-none focus:bg-white transition-all min-h-[46px] shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full text-white font-bold text-sm tracking-wide bg-[#084c8d] hover:bg-[#063b6f] active:scale-[0.99] shadow-lg shadow-[#084c8d]/25 transition-all min-h-[48px] flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Footer Link to Onboarding */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-[#52667d]">
            Don't have a plan yet?{' '}
            <button
              type="button"
              onClick={onNavigateToOnboarding}
              className="text-[#084c8d] font-bold hover:underline"
            >
              Create your diet plan &rarr;
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
