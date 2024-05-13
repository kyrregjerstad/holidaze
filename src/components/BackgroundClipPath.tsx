'use client';

import { AnimatePresence, motion } from 'framer-motion';

export const BackgroundClipPath = () => {
  return (
    <motion.div
      className="hero-clip-path h-full w-full bg-gradient-to-tr from-sky-600 to-sky-400 opacity-95 backdrop-blur-sm"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 0.95 }}
      transition={{ duration: 0.55, delay: 0.2, ease: 'easeInOut' }}
    />
  );
};
