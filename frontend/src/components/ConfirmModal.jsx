import React from 'react';

export default function ConfirmModal({
  isOpen,
  title = "Start a New Plan?",
  message = "Are you sure you want to start a new plan? Your current week's progress will be replaced.",
  confirmLabel = "Yes, Start New Plan",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl flex flex-col gap-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl shrink-0">
            ⚠️
          </div>
          <div>
            <h3 id="confirm-modal-title" className="text-xl font-black text-[#0a2240] tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-[#52667d] mt-1 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-3 text-xs text-[#52667d] flex items-center gap-2">
          <span>💡</span>
          <span>Your current stats and plan will be safely backed up before resetting.</span>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#084c8d] hover:bg-[#063b6f] shadow-md shadow-[#084c8d]/25 transition-all active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
