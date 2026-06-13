"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, ShieldAlert, ChevronRight } from "lucide-react";
import { useMindVaultStore } from "../store/useMindVaultStore";
import Button from "./ui/Button";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useMindVaultStore((state) => state.session);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About AI", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[#090d16]/70 backdrop-blur-md border-b border-white/5"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 rounded-xl bg-purple-primary/10 border border-purple-primary/30 group-hover:border-purple-primary group-hover:shadow-[0_0_15px_var(--emotional-purple-glow)] transition-all duration-300">
              <Brain className="w-6 h-6 text-purple-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Mind<span className="text-purple-primary text-glow-purple">Vault</span>
              <span className="text-xs bg-cyan-primary/20 text-cyan-primary font-mono px-1.5 py-0.5 rounded-md ml-2 border border-cyan-primary/30">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm text-slate-300 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-primary to-cyan-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session.isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="cyan" size="sm">
                  Enter Dashboard <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] left-4 right-4 z-40 p-6 rounded-2xl bg-[#090d16]/95 backdrop-blur-lg border border-white/10 md:hidden shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base py-1 font-medium transition-colors ${
                    pathname === link.href ? "text-purple-primary font-semibold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <hr className="border-white/5" />

            <div className="flex flex-col gap-3">
              {session.isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="cyan" size="md" className="w-full">
                    Enter Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
