"use client";

import React from "react";

interface ChartHeaderProps {
  host: string;
  date: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ host, date }) => {
  return (
    <div className="px-2 py-2 mb-3 flex flex-col md:flex-row md:items-center justify-between">
      {host !== "" && (
        <div className="text-xs opacity-80">
          With: <span className="text-xs uppercase">{host}</span>
        </div>
      )}
      <div className="text-sm font-medium">{date}</div>
    </div>
  );
};

export default ChartHeader;