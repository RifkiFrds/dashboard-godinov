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
import { H2 } from "../ui/Text";
import { toast } from "react-toastify";
import RoleProgressBar from "./ProjectProgressBar";
import { getDynamicStatus } from "./utils/projectHelpers";
import { getStatusColor } from "./utils/projectHelpers";

const ProjectCard = ({ project, onSelect }) => {

  const displayStatus = getDynamicStatus(project);


  return (
    <Link to={`/projects/${project.id}`}>
      <div 
        onClick={() => onSelect(project)}
        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
      >
        {/* Header Card */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(displayStatus)}`}>
              {displayStatus}
            </span>
            <h3 className="mt-2 text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <h4 className="mt-2 text-lg text-gray-400 group-hover:text-blue-600 transition-colors">
              {project.client_name}
            </h4>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">
          {project.description}
        </p>

        {/* 3-Role Progress Section */}
        <div className="space-y-3 mb-6 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            <RoleProgressBar 
              label="UI/UX Design"
              percentage={project.progress?.uiux || 0} // Mengambil dari data API
              icon={Layout}
              colorClass="bg-purple-500"
              bgClass="bg-purple-100"
              textClass="text-purple-700"
            />

            <RoleProgressBar 
              label="Backend Dev"
              percentage={project.progress?.backend || 0} // Mengambil dari data API
              icon={Server}
              colorClass="bg-orange-500"
              bgClass="bg-orange-100"
              textClass="text-orange-700"
            />

            <RoleProgressBar 
              label="Frontend Dev"
              percentage={project.progress?.frontend || 0} // Mengambil dari data API
              icon={Code}
              colorClass="bg-blue-500"
              bgClass="bg-blue-100"
              textClass="text-blue-700"
            />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Calendar size={14} />
            <span>{new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Users size={14} />
            <span>{project.team_count} Members</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;