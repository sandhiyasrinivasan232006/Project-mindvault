import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const inputId = React.useId();

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-md text-white text-sm transition-all duration-200 focus:bg-white/[0.06] focus:border-purple-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/20 placeholder-slate-500 disabled:opacity-40 disabled:pointer-events-none ${
          error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 mt-0.5">{error}</span>
      )}
    </div>
  );
}
