"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan" | "green" | "coral";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090d16] disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-primary to-[#8b5cf6] text-white hover:shadow-[0_0_20px_var(--emotional-purple-glow)] border border-purple-primary/30",
    secondary: "bg-slate-800/80 text-white hover:bg-slate-700/80 border border-slate-700/50",
    outline: "bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
    cyan: "bg-gradient-to-r from-cyan-primary to-[#00f2fe] text-slate-900 hover:shadow-[0_0_20px_var(--healing-cyan-glow)] font-semibold border border-cyan-primary/30",
    green: "bg-gradient-to-r from-green-primary to-[#38f9d7] text-slate-900 hover:shadow-[0_0_20px_var(--recovery-green-glow)] font-semibold border border-green-primary/30",
    coral: "bg-gradient-to-r from-coral-primary to-[#ff7eb3] text-white hover:shadow-[0_0_20px_var(--sunset-coral-glow)] border border-coral-primary/30"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Glare effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[drift_1s_ease-out]" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
