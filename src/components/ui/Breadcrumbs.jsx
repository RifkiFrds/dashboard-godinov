import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in bg-white/50 py-2 rounded-lg">
      <button 
        onClick={() => navigate(-1)}
        className="hover:text-blue-600 transition-colors flex items-center gap-2 mr-4 pr-4 border-r border-gray-200"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline font-medium">Back</span>
      </button>
      
      <Link to="/finance" className="hover:text-blue-600 transition-colors">
        Finance
      </Link>

      {/* Dynamic Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            {isLast ? (
              <span className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-[200px]">
                {item.label}
              </span>
            ) : (
              // Item intermediate bisa diklik jika path disediakan
              <Link 
                to={item.path || "#"} 
                className="hover:text-blue-600 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}