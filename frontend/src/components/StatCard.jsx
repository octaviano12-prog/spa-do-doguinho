import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  tone = "gold",
  trend,
}) {
  return (
    <motion.div
      className={`card stat premiumStat ${tone}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
    >
      <div className="statGlow" />

      <div className="statTop">
        <div className={`statIcon ${tone}`}>
          {Icon && <Icon size={22} />}
        </div>

        {trend && (
          <div className="statTrend positive">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="statContent">
        <span>{title}</span>

        <strong>
          {value}
        </strong>
      </div>
    </motion.div>
  );
}
