'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Facebook, Mail, Phone, Activity } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2C3E50] border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Column 1: Branding & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#5A9BCF] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                PhysioNote.AI
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm max-w-xs">
              Transformando a documentação em fisioterapia através da inteligência artificial, 
              para que você possa focar no que mais importa: seus pacientes.
            </p>
            <p className="text-gray-400 text-sm">
              © {currentYear} PhysioNote.AI.<br />
              Todos os direitos reservados.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Navegação
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link 
                  href="/#features" 
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link 
                  href="/#testimonials" 
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                >
                  Depoimentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-6">
            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Legal & Conformidade
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                  >
                    Termos de Serviço
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/lgpd" 
                    className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-block"
                  >
                    LGPD
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support/Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Suporte
              </h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:contato@physionote.ai" 
                    className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    contato@physionote.ai
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+551140028922" 
                    className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200 text-sm inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    (11) 4002-8922
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">
                Siga-nos
              </h4>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/physionoteai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/physionoteai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com/physionoteai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#5A9BCF] transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-[#1a252f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs text-center md:text-left">
              Desenvolvido com ❤️ para fisioterapeutas brasileiros
            </p>
            <p className="text-gray-400 text-xs text-center md:text-right">
              PhysioNote.AI - Inteligência Artificial aplicada à Fisioterapia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;