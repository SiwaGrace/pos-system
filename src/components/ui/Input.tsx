import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}