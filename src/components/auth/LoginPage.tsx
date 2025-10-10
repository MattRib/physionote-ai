'use client';

import React, { useState } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login - substituir com lógica real
    setTimeout(() => {
      console.log('Login attempt:', { email, password });
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-8 
                      animate-fade-in-up border border-gray-100">
          
          {/* Logo and Title */}
          <div className="text-center space-y-2 opacity-0 animate-hero-title">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-[#5A9BCF] rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#333333]">
                  PhysioNote.AI
                </h1>
              </div>
            </Link>
            <p className="text-neutral-medium text-sm">
              Documentação inteligente para fisioterapeutas
            </p>
          </div>

          {/* Welcome Message */}
          <div className="text-center opacity-0 animate-hero-subtitle">
            <h2 className="text-2xl font-semibold text-neutral-dark mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-neutral-medium">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2 opacity-0 animate-hero-button-primary">
              <label htmlFor="email" className="text-sm font-medium text-neutral-dark block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-medium" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                           transition-all duration-300 text-neutral-dark placeholder-neutral-medium
                           hover:border-primary-blue"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 opacity-0 animate-hero-button-secondary">
              <label htmlFor="password" className="text-sm font-medium text-neutral-dark block">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-medium" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent
                           transition-all duration-300 text-neutral-dark placeholder-neutral-medium
                           hover:border-primary-blue"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center
                           text-neutral-medium hover:text-primary-blue transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end opacity-0 animate-nav-item-1">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary-blue hover:text-blue-700 
                         transition-colors duration-200 font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-blue text-white py-3 px-6 rounded-lg
                       font-semibold text-lg flex items-center justify-center gap-2
                       hover:bg-blue-700 hover:scale-105 transform transition-all duration-400
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:scale-100 opacity-0 animate-nav-item-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative opacity-0 animate-nav-item-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-medium">ou</span>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="text-center space-y-4 opacity-0 animate-header-login">
            <p className="text-neutral-medium text-sm">
              Ainda não tem uma conta?{' '}
              <Link 
                href="/signup" 
                className="text-primary-blue hover:text-blue-700 font-semibold
                         transition-colors duration-200"
              >
                Criar Conta
              </Link>
            </p>

            {/* Footer Links */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-medium">
                <Link 
                  href="/privacy" 
                  className="hover:text-primary-blue transition-colors duration-200"
                >
                  Política de Privacidade
                </Link>
                <span className="text-gray-300">•</span>
                <Link 
                  href="/terms" 
                  className="hover:text-primary-blue transition-colors duration-200"
                >
                  Termos de Serviço
                </Link>
                <span className="text-gray-300">•</span>
                <Link 
                  href="/lgpd" 
                  className="hover:text-primary-blue transition-colors duration-200"
                >
                  LGPD
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-neutral-medium hover:text-primary-blue transition-colors duration-200
                     text-sm font-medium inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Voltar para página inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;