"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/rollc/brand/Logo";

export function Intro() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
      }}
    >
      <motion.div
        initial={reduced ? { opacity: 0 } : { scale: 0.94, opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="intro-logo-wrap">
          <Logo locale="ar" tone="duo" />
        </div>
      </motion.div>
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        style={{
          width: "clamp(40px, 8vw, 80px)",
          height: "1px",
          background: "var(--gold)",
          transformOrigin: "center",
          marginTop: "18px",
        }}
      />
    </motion.div>
  );
}
