import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell premiumShell">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="overlay"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className="main">
        <Header
          onMenuClick={() => setOpen(true)}
        />

        <motion.main
          className="page"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="pageGlow" />

          {children}
        </motion.main>
      </div>
    </div>
  );
}
