'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Toggle glass background once the user leaves the top of the page.
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClassName = `pointer-events-none fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-500 ease-out ${
    isScrolled ? 'scale-[0.995]' : 'scale-100'
  }`;

  const islandClassName = `flex items-center gap-8 rounded-full border border-indigo-100/70 bg-white/80 px-6 py-3 shadow-[0_20px_70px_-35px_rgba(99,102,241,0.35)] backdrop-blur-2xl transition-all duration-500 ease-out ${
    isScrolled ? 'scale-[0.98] border-indigo-100/90 bg-white/85' : 'scale-100'
  }`;

  return (
  <header className={headerClassName}>
      <div className="pointer-events-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile layout retains simple top bar */}
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4338CA] to-[#6366F1] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">PhysioNote.AI</span>
          </div>
          <Link href="/login" className="opacity-0 animate-header-login">
            <span className="rounded-full border border-indigo-200 bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-indigo-600">
              Login
            </span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center">
          <div className={islandClassName}>
            <div className="flex items-center gap-2 opacity-0 animate-logo-entrance">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4338CA] to-[#6366F1] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">PhysioNote.AI</span>
            </div>

            <nav className="flex items-center gap-8">
              <Link 
                href="#home" 
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 opacity-0 animate-nav-item-1"
              >
                Home
              </Link>
              <Link 
                href="#about" 
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 opacity-0 animate-nav-item-2"
              >
                Sobre
              </Link>
              <Link 
                href="#features" 
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 opacity-0 animate-nav-item-3"
              >
                Features
              </Link>
            </nav>

            <Link href="/login" className="opacity-0 animate-header-login">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_40px_-20px_rgba(99,102,241,0.55)] transition duration-300 hover:from-[#4338CA] hover:to-[#7C3AED]">
                Login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;