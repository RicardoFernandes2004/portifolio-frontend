"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface MotionFadeProps extends HTMLMotionProps<"div"> {
  delay?: number;
  children: ReactNode;
}

export function MotionFade({ delay = 0, children, ...rest }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
