import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "glass-interactive" | "flat" | "neon-purple" | "neon-blue" | "neon-green";
  children: React.ReactNode;
}

export default function Card({
  variant = "glass-interactive",
  children,
  className = "",
  ...props
}: CardProps) {
  const baseStyle = "rounded-2xl border transition-all duration-300 overflow-hidden";
  
  const variantStyles = {
    glass: "bg-slate-900/40 backdrop-blur-xl border-white/5 shadow-2xl",
    "glass-interactive": "bg-white/[0.03] backdrop-blur-lg border-white/6 hover:bg-white/[0.06] hover:border-white/12 shadow-xl hover:-translate-y-1 hover:shadow-2xl",
    flat: "bg-slate-900/90 border-slate-800 shadow-md",
    "neon-purple": "bg-slate-900/50 backdrop-blur-xl border-purple-primary/20 shadow-[0_0_15px_rgba(123,97,255,0.05)] hover:border-purple-primary/40 hover:shadow-[0_0_25px_rgba(123,97,255,0.15)]",
    "neon-blue": "bg-slate-900/50 backdrop-blur-xl border-blue-primary/20 shadow-[0_0_15px_rgba(79,172,254,0.05)] hover:border-blue-primary/40 hover:shadow-[0_0_25px_rgba(79,172,254,0.15)]",
    "neon-green": "bg-slate-900/50 backdrop-blur-xl border-green-primary/20 shadow-[0_0_15px_rgba(67,233,123,0.05)] hover:border-green-primary/40 hover:shadow-[0_0_25px_rgba(67,233,123,0.15)]"
  };

  return (
    <div
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
