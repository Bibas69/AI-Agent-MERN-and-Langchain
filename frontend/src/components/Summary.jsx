import React, { useEffect, useState } from "react";
import axios from "axios";
import getBackendUrl from "../utils/getBackendUrl";
import { useAuth } from "../context/AuthContext";

const Summary = () => {
  const [tasks, setTasks] = useState([]);
  const [hovered, setHovered] = useState(null);
  const { currentUser } = useAuth();

  const fetchTasks = async () => {
    try {
      const now = new Date();
      const res = await axios.get(`${getBackendUrl()}/api/task/getTaskBySingleDate`, {
        params: { uid: currentUser.uid, date: new Date(now) },
      });
      if (!res.data.success) return;
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // --- Stats ---
  const totalTasks = tasks.length || 0;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const cancelledCount = tasks.filter((t) => t.status === "cancelled").length;
  const incompleteCount = tasks.filter((t) => t.status === "incomplete").length;

  const completedDeg = totalTasks ? (completedCount / totalTasks) * 360 : 0;
  const cancelledDeg = totalTasks ? (cancelledCount / totalTasks) * 360 : 0;
  const incompleteDeg = totalTasks ? (incompleteCount / totalTasks) * 360 : 0;

  const completedPercent = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;
  const cancelledPercent = totalTasks ? Math.round((cancelledCount / totalTasks) * 100) : 0;
  const incompletePercent = totalTasks ? Math.round((incompleteCount / totalTasks) * 100) : 0;

  // Calculate mouse angle relative to chart center - THIS FIXES THE HOVER BUG
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y);
    const outerRadius = rect.width / 2;
    const innerRadius = outerRadius * 0.27;
    
    // Only detect hover if in donut ring area
    if (distance < innerRadius || distance > outerRadius) {
      setHovered(null);
      return;
    }
    
    // Calculate angle (0° = top, clockwise)
    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // Determine which segment
    if (completedDeg > 0 && angle < completedDeg) {
      setHovered("completed");
    } else if (cancelledDeg > 0 && angle < completedDeg + cancelledDeg) {
      setHovered("cancelled");
    } else if (incompleteDeg > 0) {
      setHovered("incomplete");
    } else {
      setHovered(null);
    }
  };

  return (
    <div className="w-72 h-96 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-xl border border-zinc-700 shadow-lg shadow-black/40 p-4 flex flex-col items-center gap-6">
      <p className="text-white text-lg font-semibold tracking-wide">
        Today's Summary
      </p>

      <div 
        className="relative w-52 h-52 flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Donut background with hover effects */}
        <div
          className="absolute w-full h-full rounded-full transition-all duration-300"
          style={{
            background: totalTasks
              ? `conic-gradient(
                  ${hovered === "completed" ? "#34d399" : "#22c55e"} 0deg ${completedDeg}deg,
                  ${hovered === "cancelled" ? "#f87171" : "#ef4444"} ${completedDeg}deg ${completedDeg + cancelledDeg}deg,
                  ${hovered === "incomplete" ? "#c084fc" : "#a855f7"} ${completedDeg + cancelledDeg}deg 360deg
                )`
              : "#27272A",
            boxShadow:
              totalTasks > 0
                ? hovered === "completed"
                  ? "0 0 40px rgba(34, 197, 94, 0.5), inset 0 0 15px rgba(255,255,255,0.15)"
                  : hovered === "cancelled"
                  ? "0 0 40px rgba(239, 68, 68, 0.5), inset 0 0 15px rgba(255,255,255,0.15)"
                  : hovered === "incomplete"
                  ? "0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 15px rgba(255,255,255,0.15)"
                  : "0 0 30px rgba(0,0,0,0.6), inset 0 0 10px rgba(255,255,255,0.1)"
                : "none",
            transform: hovered ? "scale(1.02)" : "scale(1)",
            cursor: totalTasks > 0 ? "pointer" : "default",
          }}
        />

        {/* Inner donut */}
        <div
          className={`absolute w-28 h-28 bg-zinc-900 rounded-full shadow-inner transition-all duration-300 ${
            hovered === "completed"
              ? "ring-2 ring-green-400/70 shadow-[0_0_25px_#22c55e]"
              : hovered === "cancelled"
              ? "ring-2 ring-red-400/70 shadow-[0_0_25px_#ef4444]"
              : hovered === "incomplete"
              ? "ring-2 ring-purple-400/70 shadow-[0_0_25px_#a855f7]"
              : "ring-1 ring-zinc-700/50"
          }`}
        ></div>

        {/* Inner text */}
        <div className="absolute text-center transition-all duration-300 pointer-events-none px-2">
          {totalTasks > 0 ? (
            <>
              <p
                className={`text-xl font-bold transition-colors duration-200 ${
                  hovered === "completed"
                    ? "text-green-400"
                    : hovered === "cancelled"
                    ? "text-red-400"
                    : hovered === "incomplete"
                    ? "text-purple-400"
                    : "text-white"
                }`}
              >
                {hovered === "completed"
                  ? completedCount
                  : hovered === "cancelled"
                  ? cancelledCount
                  : hovered === "incomplete"
                  ? incompleteCount
                  : totalTasks}
              </p>
              <p
                className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  hovered === "completed"
                    ? "text-green-300"
                    : hovered === "cancelled"
                    ? "text-red-300"
                    : hovered === "incomplete"
                    ? "text-purple-300"
                    : "text-zinc-400"
                }`}
              >
                {hovered === "completed"
                  ? `${completedPercent}% Complete`
                  : hovered === "cancelled"
                  ? `${cancelledPercent}% Cancelled`
                  : hovered === "incomplete"
                  ? `${incompletePercent}% Incomplete`
                  : "Total Tasks"}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg 
                className="w-10 h-10 text-zinc-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-zinc-400 text-xs text-center leading-tight">
                Add tasks to<br />view summary
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex justify-center gap-6 mt-2">
        <div className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110">
          <div className="w-4 h-4 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
          <p className="text-zinc-300 text-xs font-medium">Complete</p>
          {totalTasks > 0 && (
            <p className="text-green-400 text-xs font-semibold">{completedPercent}%</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110">
          <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
          <p className="text-zinc-300 text-xs font-medium">Cancelled</p>
          {totalTasks > 0 && (
            <p className="text-red-400 text-xs font-semibold">{cancelledPercent}%</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110">
          <div className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]"></div>
          <p className="text-zinc-300 text-xs font-medium">Incomplete</p>
          {totalTasks > 0 && (
            <p className="text-purple-400 text-xs font-semibold">{incompletePercent}%</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;