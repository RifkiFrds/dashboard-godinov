import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Layout, 
  Server, 
  Code, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Play, 
  Pause, 
  CheckCircle,
  Search,
  Filter,
  Users
} from "lucide-react";
import { toast } from "react-toastify";


const RoleProgressBar = ({ icon: Icon, label, percentage, colorClass, bgClass, textClass }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className={`p-1.5 rounded-md ${bgClass} ${textClass}`}>
      <Icon size={14} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-bold text-gray-800">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full ${colorClass} transition-all duration-500`} 
          style={{ width: `${percentage}%` }} 
        ></div>
      </div>
    </div>
  </div>
);


export default RoleProgressBar;