import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8055";

export default function SetPasswordModal({ isOpen, email, onSuccess, onDismiss }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || password.length < 8) {
      setErrorMsg("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || "Failed to set password");
      }

      if (data.token) {
        onSuccess(data.token);
      } else {
        onDismiss();
      }
    } catch (err) {
      console.error("Set password error:", err);
      setErrorMsg(err.message || "Failed to save password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl flex flex-col gap-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-xl shrink-0">
            🔒
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0a2240] tracking-tight">
              Secure Your Account
            </h3>
            <p className="text-xs sm:text-sm text-[#52667d] mt-1 font-medium leading-relaxed">
              Set a password for <span className="text-[#084c8d] font-bold">{email}</span> so you can log in and access your plan on any device.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-1">
          <div>
            <label className="block text-xs font-bold text-[#1e3a58] mb-1 uppercase tracking-wider">
              Create Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full bg-[#f8fafc] border border-[#d0dbe7] rounded-full px-4 py-2.5 text-sm text-[#0a2240] focus:outline-none focus:border-[#084c8d] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e3a58] mb-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              className="w-full bg-[#f8fafc] border border-[#d0dbe7] rounded-full px-4 py-2.5 text-sm text-[#0a2240] focus:outline-none focus:border-[#084c8d] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onDismiss}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Later
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#084c8d] hover:bg-[#063b6f] shadow-md shadow-[#084c8d]/25 transition-all"
            >
              {isSubmitting ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
