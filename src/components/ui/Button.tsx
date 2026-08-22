import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}