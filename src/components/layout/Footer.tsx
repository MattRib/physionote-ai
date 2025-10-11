"use client";
import React from "react";
import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Phone,
  Activity,
} from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-glass">
      {" "}
      <div className="footer-content">
        {" "}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {" "}
          <div className="grid grid-cols-1 gap-12 text-slate-700 md:grid-cols-3 lg:gap-16">
            {" "}
            <div className="space-y-4">
              {" "}
              <div className="flex items-center gap-2">
                {" "}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4338CA] to-[#6366F1] shadow-lg shadow-[#4338CA]/30">
                  {" "}
                  <Activity className="h-5 w-5 text-white" />{" "}
                </div>{" "}
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {" "}
                  PhysioNote.AI{" "}
                </h3>{" "}
              </div>{" "}
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                {" "}
                Documentação clínica com IA que reduz o tempo administrativo e
                mantém a precisão nas sessões de fisioterapia.{" "}
              </p>{" "}
              <p className="text-xs uppercase tracking-[0.25em] text-indigo-400/80">
                {" "}
                © {currentYear} PhysioNote.AI • Todos os direitos reservados{" "}
              </p>{" "}
            </div>{" "}
            <div className="space-y-4">
              {" "}
              <h4 className="text-lg font-semibold text-slate-900">
                {" "}
                Navegação{" "}
              </h4>{" "}
              <ul className="space-y-3 text-sm">
                {" "}
                <li>
                  {" "}
                  <Link
                    href="/"
                    className="transition-colors duration-200 hover:text-indigo-500"
                  >
                    {" "}
                    Home{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/#about"
                    className="transition-colors duration-200 hover:text-indigo-500"
                  >
                    {" "}
                    Sobre{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/#features"
                    className="transition-colors duration-200 hover:text-indigo-500"
                  >
                    {" "}
                    Funcionalidades{" "}
                  </Link>{" "}
                </li>{" "}
                <li>
                  {" "}
                  <Link
                    href="/#testimonials"
                    className="transition-colors duration-200 hover:text-indigo-500"
                  >
                    {" "}
                    Depoimentos{" "}
                  </Link>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            <div className="space-y-6">
              {" "}
              <div className="space-y-4">
                {" "}
                <h4 className="text-lg font-semibold text-slate-900">
                  {" "}
                  Legal & Conformidade{" "}
                </h4>{" "}
                <ul className="space-y-3 text-sm">
                  {" "}
                  <li>
                    {" "}
                    <Link
                      href="/privacy"
                      className="transition-colors duration-200 hover:text-indigo-500"
                    >
                      {" "}
                      Política de Privacidade{" "}
                    </Link>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <Link
                      href="/terms"
                      className="transition-colors duration-200 hover:text-indigo-500"
                    >
                      {" "}
                      Termos de Serviço{" "}
                    </Link>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <Link
                      href="/lgpd"
                      className="transition-colors duration-200 hover:text-indigo-500"
                    >
                      {" "}
                      LGPD{" "}
                    </Link>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
              <div className="space-y-4 text-sm">
                {" "}
                <h4 className="text-lg font-semibold text-slate-900">
                  {" "}
                  Suporte{" "}
                </h4>{" "}
                <ul className="space-y-3">
                  {" "}
                  <li>
                    {" "}
                    <a
                      href="mailto:contato@physionote.ai"
                      className="inline-flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-indigo-500"
                    >
                      {" "}
                      <Mail className="h-4 w-4" /> contato@physionote.ai{" "}
                    </a>{" "}
                  </li>{" "}
                  <li>
                    {" "}
                    <a
                      href="tel:+551140028922"
                      className="inline-flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-indigo-500"
                    >
                      {" "}
                      <Phone className="h-4 w-4" /> (11) 4002-8922{" "}
                    </a>{" "}
                  </li>{" "}
                </ul>{" "}
              </div>{" "}
              <div className="space-y-4 text-sm">
                {" "}
                <h4 className="font-medium text-slate-700">Siga-nos</h4>{" "}
                <div className="flex items-center gap-4 text-slate-500">
                  {" "}
                  <a
                    href="https://twitter.com/physionoteai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform duration-300 hover:-translate-y-1 hover:text-indigo-500"
                    aria-label="Twitter"
                  >
                    {" "}
                    <Twitter className="h-5 w-5" />{" "}
                  </a>{" "}
                  <a
                    href="https://linkedin.com/company/physionoteai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform duration-300 hover:-translate-y-1 hover:text-indigo-500"
                    aria-label="LinkedIn"
                  >
                    {" "}
                    <Linkedin className="h-5 w-5" />{" "}
                  </a>{" "}
                  <a
                    href="https://facebook.com/physionoteai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform duration-300 hover:-translate-y-1 hover:text-indigo-500"
                    aria-label="Facebook"
                  >
                    {" "}
                    <Facebook className="h-5 w-5" />{" "}
                  </a>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="footer-bottom mt-12 text-xs text-slate-500">
            {" "}
            <p>Desenvolvido com ❤️ para fisioterapeutas brasileiros</p>{" "}
            <p className="mt-2 text-[0.72rem] uppercase tracking-[0.2em] text-slate-400">
              {" "}
              PhysioNote.AI · Inteligência Artificial aplicada à Fisioterapia{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
};
export default Footer;
