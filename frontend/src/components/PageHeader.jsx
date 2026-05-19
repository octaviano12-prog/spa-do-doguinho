import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      className="pageHeader premiumPageHeader"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pageHeaderText">
        <span className="pageKicker">Painel Administrativo</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && <div className="pageHeaderAction">{action}</div>}
    </motion.div>
  );
}
