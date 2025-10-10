'use client';

import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 opacity-0 animate-logo-entrance">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#5A9BCF] rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-[#333333]">
                  PhysioNote.AI
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#home" 
              className="text-neutral-dark hover:text-primary-blue transition-colors duration-200
                         opacity-0 animate-nav-item-1"
            >
              Home
            </Link>
            <Link 
              href="#about" 
              className="text-neutral-dark hover:text-primary-blue transition-colors duration-200
                         opacity-0 animate-nav-item-2"
            >
              Sobre
            </Link>
            <Link 
              href="#features" 
              className="text-neutral-dark hover:text-primary-blue transition-colors duration-200
                         opacity-0 animate-nav-item-3"
            >
              Features
            </Link>
          </nav>

          {/* Login Button */}
          <div className="flex items-center">
            <Link href="/login">
              <button className="bg-primary-blue text-white px-6 py-2 rounded-lg font-medium 
                               hover:bg-blue-700 hover:scale-110 transform transition-all duration-300 
                               shadow-lg hover:shadow-xl
                               opacity-0 animate-header-login">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;