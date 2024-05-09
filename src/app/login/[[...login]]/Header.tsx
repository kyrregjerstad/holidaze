'use client';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.h1
      className="text-center text-6xl font-bold tracking-tighter text-white sm:text-8xl md:p-20 md:text-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, delay: 0.85, ease: 'easeInOut' }}
    >
      Holidaze
    </motion.h1>
  );
};
