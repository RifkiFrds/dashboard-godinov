import React, { useState, useEffect } from 'react';
import { Play, Square, Loader2 } from 'lucide-react';

const TimerModal = ({ isOpen, task, onClose, onFinish }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setStartTime(Date.now());
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    onFinish(task.id, seconds); // Kirim waktu ke fungsi finish
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md text-center shadow-2xl">
        <h2 className="text-xl font-bold mb-2">{task?.title}</h2>
        <p className="text-gray-500 text-sm mb-6">Mengerjakan tugas sebagai {task?.role}</p>

        <div className="text-6xl font-mono font-bold text-blue-600 mb-8 tracking-tighter">
          {new Date(seconds * 1000).toISOString().substr(11, 8)}
        </div>

        <div className="flex gap-4">
          {!isRunning ? (
            <button onClick={handleStart} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Play size={20} /> Start Work
            </button>
          ) : (
            <button onClick={handleStop} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Square size={20} /> Stop & Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerModal;