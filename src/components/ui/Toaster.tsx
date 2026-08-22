"use client";

import { useToastStore } from "@/store/toastStore";

const typeStyles = {
  success: "border-emerald-500 bg-emerald-600 text-white",
  error: "border-red-500 bg-red-600 text-white",
  warning: "border-amber-500 bg-amber-500 text-white",
  info: "border-indigo-500 bg-indigo-600 text-white",
};

const icons = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "ℹ",
};

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg ${typeStyles[toastItem.type]}`}
        >
          <span className="mt-0.5 text-sm font-bold">{icons[toastItem.type]}</span>
          <p className="flex-1 text-sm font-medium">{toastItem.message}</p>
          <button
            onClick={() => dismiss(toastItem.id)}
            className="text-sm opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}