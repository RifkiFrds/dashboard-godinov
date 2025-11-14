import React from 'react'
import { ChevronRight } from "lucide-react";

export default function QuickAction({ title, desc }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:bg-gray-100">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </button>
  );
}
