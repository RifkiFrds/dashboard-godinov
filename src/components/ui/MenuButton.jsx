import React from 'react';
import { ChevronRight } from "lucide-react";

export default function MenuButton({ title, desc, icon: Icon, color = "bg-blue-50 text-blue-600" }) {
  return (
    <div className="group relative flex h-full w-full cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
      
      {/* Header: Icon & Arrow */}
      <div className="flex w-full items-start justify-between mb-4">
        <div className={`rounded-lg p-3 ${color} transition-colors group-hover:scale-110`}>
          {Icon && <Icon size={24} />}
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRight className="text-gray-400" size={20} />
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors text-base">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}