"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChartData } from "@/types";

interface ChartsListProps {
  charts: ChartData;
  openSubView: (id: string) => void;
}

const ChartsList: React.FC<ChartsListProps> = ({ charts, openSubView }) => {
  return (
    <div className="w-full h-full p-0 overflow-hidden relative overflow-y-auto pr-1">
      <div className="space-y-2">
        {Object.values(charts).map((chart, index) => (
          <motion.div
            key={chart.id}
            onClick={() => openSubView(chart.id)}
            className="px-3 py-2 border border-dark/50 cursor-pointer select-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.25 }}
          >
            <div className="flex flex-col">
              <div className="font-bold">{chart.label}</div>
              <div className="text-sm opacity-75">{chart.date}{chart.host ? `, with ${chart?.host}` : ""}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChartsList;
