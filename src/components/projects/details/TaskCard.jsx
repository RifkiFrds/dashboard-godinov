import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CheckCircle2, Clock, UserCheck, Lock, Key, ShieldAlert, KeyRound } from "lucide-react";


const TaskCard = ({ task, index, isDraggable = true, onOpenOtp }) => {
  const isDone = task.status === 'Done';
  const isBlocked = task.status === 'Blocked';

  const renderContent = (provided = {}, snapshot = {}) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`mb-4 outline-none ${snapshot.isDragging ? "z-50" : ""}`}
    >
      <div className={`
        relative overflow-hidden p-4 rounded-xl border transition-all duration-200
        ${isDone ? 'opacity-75 grayscale-[0.3] bg-gray-50 border-gray-200' : 'bg-white shadow-sm hover:shadow-md'}
        ${isBlocked ? 'border-orange-200 bg-orange-50/30 ring-1 ring-orange-100' : 'border-gray-200'}
        ${!isDraggable || isBlocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        ${snapshot.isDragging ? "ring-2 ring-blue-500 shadow-xl scale-[1.02]" : ""}
      `}>
        
        {/* Header: Priority & Status Badge */}
        <div className="flex justify-between items-start mb-3">
           <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
             isBlocked ? 'bg-orange-100 text-orange-700 border-orange-200' :
             task.priority === 'High' || task.priority === 'Critical' 
              ? 'bg-red-50 text-red-600 border-red-100' 
              : 'bg-blue-50 text-blue-600 border-blue-100'
           }`}>
            {isBlocked ? 'Action Required' : task.priority}
          </span>
          
          <div className="group relative flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                isBlocked ? 'bg-orange-500 text-white' : 'bg-gradient-to-tr from-gray-700 to-gray-900 text-white'
            }`}>
              {isBlocked ? <Lock size={12} /> : (task.assignee?.charAt(0).toUpperCase() || 'S')}
            </div>
          </div>
        </div>

        {/* Content */}
        <h4 className={`text-sm font-bold mb-1 ${
            isDone ? 'text-gray-500 line-through' : 
            isBlocked ? 'text-orange-900' : 'text-gray-800'
        }`}>
          {task.title}
        </h4>
        
        {isBlocked ? (
            <div className="my-3 p-2 rounded-lg bg-orange-100/50 border border-orange-200">
                <p className="text-[10px] text-orange-800 font-medium leading-tight flex items-start gap-1.5">
                    <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                    Skip step terdeteksi. Silahkan masukkan kode OTP dari PM untuk melanjutkan ke Done.
                </p>
                <button 
                    onClick={() => onOpenOtp(task)}
                    className="w-full mt-2 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                    <KeyRound size={12} /> Input OTP Code
                </button>
            </div>
        ) : task.note && (
          <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {task.note}
          </p>
        )}

        {/* Footer */}
        <div className={`flex flex-col gap-2 pt-3 border-t ${isBlocked ? 'border-orange-100' : 'border-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter ${
                isBlocked ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {isDone ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : isBlocked ? (
                <Lock size={14} className="animate-pulse" />
              ) : (
                <Clock size={14} className="text-blue-500" />
              )}
              {task.status}
            </div>

            <div className="flex items-center gap-1 text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              <UserCheck size={10} />
              <span>{task.assignee || 'Staff'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isDraggable) {
      return renderContent();
  }

  return (
    <Draggable 
      draggableId={task.id.toString()} 
      index={index} 
      // Kunci pergerakan jika status Done ATAU Blocked
      isDragDisabled={isDone || isBlocked} 
    >
      {(provided, snapshot) => renderContent(provided, snapshot)}
    </Draggable>
  );
};

export default TaskCard;