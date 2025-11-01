import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, User } from 'lucide-react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('/');
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/task", icon: CheckSquare, label: "Tasks" },
    { path: "/calender", icon: Calendar, label: "Calendar" },
    { path: "/profile", icon: User, label: "Profile" }
  ];

  return (
    <div className='w-screen z-1000 fixed top-0 left-0 flex items-start justify-center pt-1 px-4'>
      <div className='relative w-[90%]'>
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl p-[1px]">
          <div 
            className="absolute inset-0 rounded-2xl opacity-40"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease infinite'
            }}
          />
        </div>

        {/* Main navbar content */}
        <nav className='relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl m-[1px]'>
          <div className='flex items-center justify-center gap-40 px-8 py-4'>
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = activeTab === path;
              return (
                <button 
                  key={path}
                  onClick={() => setActiveTab(path)}
                  className='group relative flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer'
                >
                  {/* Icon container with glow effect */}
                  <div className='relative'>
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive 
                          ? 'text-white scale-110' 
                          : 'text-slate-400 group-hover:text-white group-hover:scale-105'
                      }`}
                      strokeWidth={1.5}
                    />
                    
                    {/* Active indicator glow */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 blur-lg opacity-60 -z-10"
                        style={{
                          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6), rgba(139, 92, 246, 0.4), transparent)'
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span 
                    className={`text-xs font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-white opacity-100' 
                        : 'text-slate-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse" />
                  )}

                  {/* Hover/Active background */}
                  <div 
                    className={`absolute inset-0 -z-20 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10' 
                        : 'bg-slate-800/0 group-hover:bg-slate-800/50'
                    }`}
                    style={{
                      transform: 'scale(1.6)',
                      padding: '0.75rem'
                    }}
                  />
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom accent glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rounded-full blur-sm" />
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Navbar;