"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Intro } from "@/components/rollc/ui/Intro";

export function HomeSplash() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-first")) {
      // Remove class so CSS pseudo-element yields to the React overlay
      document.documentElement.classList.remove("intro-first");
      setLoading(true);
      sessionStorage.setItem("rollc_intro_seen", "1");
      const t = setTimeout(() => setLoading(false), 1300);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && <Intro />}
    </AnimatePresence>
  );
}
