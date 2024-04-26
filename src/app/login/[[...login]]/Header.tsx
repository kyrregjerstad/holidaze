'use client';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.h1
      className="p-20 text-8xl font-bold tracking-tighter text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.85, delay: 0.85, ease: 'easeInOut' }}
    >
      Holidaze
    </motion.h1>
  );
};
