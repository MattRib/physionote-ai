'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delay = 0 }) => {
  const composedClassName = className ? className : undefined;
  const prefersReducedMotion = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1] as const;

  if (prefersReducedMotion) {
    return <div className={composedClassName}>{children}</div>;
  }

  return (
    <motion.div
      className={composedClassName}
      initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
  transition={{ duration: 0.75, ease: easeOut, delay }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
