'use client';

import { motion } from 'framer-motion';

export const BackgroundImage = () => {
  return (
    <motion.img
      src="/assets/holidaze-bg-2.webp"
      alt=""
      className=" h-full w-full object-cover"
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
    />
  );
};
